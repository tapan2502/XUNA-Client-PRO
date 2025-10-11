import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";

type RequestStatus = "pending" | "accepted" | "rejected";
type RequestMap = Record<string, { status: RequestStatus; email: string }>;

export interface UserData {
  name: string;
  email: string;
  role: "admin" | "user" | "super-admin";
  createdByAdmin: boolean;
  createdAt: unknown;
  updatedAt: unknown;
  hasToppedUp?: boolean;
  totalBalance?: number;
  sentRequests?: RequestMap;
  receivedRequests?: RequestMap;
  creditsToAdd?: number;
  entitlements: {
    planKey: string;
    name: string;
    agentsIncluded: number;
    monthlyCredits: number;
  };
  plan_lookup_key: string;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  impersonatedUser: User | null;
  impersonatedUserData: UserData | null;
  isImpersonating: boolean;
  loading: boolean;
  initializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userData: null,
  impersonatedUser: null,
  impersonatedUserData: null,
  isImpersonating: false,
  loading: false,
  initializing: true,
  error: null,
};

const defaultEntitlements = {
  planKey: "Free",
  name: "Free Plan",
  agentsIncluded: 1,
  monthlyCredits: 50,
};

const coerceDateString = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "seconds" in value && typeof (value as any).seconds === "number") {
    const seconds = (value as any).seconds as number;
    return new Date(seconds * 1000).toISOString();
  }
  return new Date().toISOString();
};

const normalizeUserData = (data: Partial<UserData>): UserData => {
  const entitlements = data.entitlements ?? defaultEntitlements;
  return {
    name: data.name ?? "",
    email: data.email ?? "",
    role: data.role ?? "user",
    createdByAdmin: data.createdByAdmin ?? false,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
    hasToppedUp: data.hasToppedUp ?? false,
    totalBalance: data.totalBalance ?? 0,
    sentRequests: data.sentRequests ?? {},
    receivedRequests: data.receivedRequests ?? {},
    creditsToAdd: data.creditsToAdd ?? 0,
    entitlements: {
      planKey: entitlements.planKey ?? defaultEntitlements.planKey,
      name: entitlements.name ?? defaultEntitlements.name,
      agentsIncluded: entitlements.agentsIncluded ?? defaultEntitlements.agentsIncluded,
      monthlyCredits: entitlements.monthlyCredits ?? defaultEntitlements.monthlyCredits,
    },
    plan_lookup_key: data.plan_lookup_key ?? entitlements.planKey ?? "Price",
  };
};

const createDefaultUserData = (user: User): UserData => {
  const email = user.email ?? "";
  return normalizeUserData({
    name: user.displayName ?? (email ? email.split("@")[0] : "User"),
    email,
    createdByAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    hasToppedUp: false,
    totalBalance: 0,
    sentRequests: {},
    receivedRequests: {},
    creditsToAdd: 50,
    entitlements: defaultEntitlements,
    plan_lookup_key: "Price",
  });
};

const createMockUser = (userId: string, data: UserData): User => {
  const now = new Date().toISOString();
  return {
    uid: userId,
    email: data.email,
    emailVerified: true,
    displayName: data.name ?? null,
    isAnonymous: false,
    providerData: [],
    providerId: "firebase",
    metadata: {
      creationTime: coerceDateString(data.createdAt),
      lastSignInTime: now,
    },
    refreshToken: "",
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "",
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
  } as unknown as User;
};

const checkExistingSignInMethods = async (email: string): Promise<string[]> => {
  try {
    return await fetchSignInMethodsForEmail(auth, email);
  } catch {
    return [];
  }
};

const resolveSignInError = async (error: FirebaseError, email: string): Promise<string> => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found": {
      const methods = await checkExistingSignInMethods(email);
      if (methods.includes("google.com")) {
        return "This email is registered with Google. Please sign in with Google.";
      }
      return "No account found with this email address";
    }
    case "auth/wrong-password":
    case "auth/invalid-credential": {
      const methods = await checkExistingSignInMethods(email);
      if (methods.includes("google.com")) {
        return "This email is registered with Google. Please sign in with Google.";
      }
      return "Invalid email or password";
    }
    default:
      return "An error occurred during sign in";
  }
};

const resolveSignUpError = async (error: FirebaseError, email: string): Promise<string> => {
  switch (error.code) {
    case "auth/email-already-in-use": {
      const methods = await checkExistingSignInMethods(email);
      if (methods.includes("google.com")) {
        return "This email is registered with Google. Please sign in with Google.";
      }
      return "This email is already registered. Please sign in instead.";
    }
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled";
    case "auth/weak-password":
      return "Password is too weak";
    default:
      return "An error occurred during sign up";
  }
};

const describeFirebaseError = (error: unknown, fallback: string) =>
  error instanceof FirebaseError ? error.message : error instanceof Error ? error.message : fallback;

const fetchUserData = async (uid: string): Promise<UserData | null> => {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return normalizeUserData(snapshot.data() as Partial<UserData>);
};

let authListenerRegistered = false;
let authUnsubscribe: (() => void) | null = null;
let userDocUnsubscribe: (() => void) | null = null;

const detachUserDocListener = () => {
  if (userDocUnsubscribe) {
    userDocUnsubscribe();
    userDocUnsubscribe = null;
  }
};

export const initAuthListener = createAsyncThunk("auth/initListener", async (_, { dispatch }) => {
  if (authListenerRegistered) return;
  authListenerRegistered = true;
  authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    dispatch(authSlice.actions.setUser(firebaseUser));
    dispatch(authSlice.actions.setError(null));
    detachUserDocListener();

    if (!firebaseUser) {
      dispatch(authSlice.actions.setUserData(null));
      dispatch(authSlice.actions.clearImpersonation());
      dispatch(authSlice.actions.setInitializing(false));
      return;
    }

    try {
      const data = await fetchUserData(firebaseUser.uid);
      if (data) {
        dispatch(authSlice.actions.setUserData(data));
        userDocUnsubscribe = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (snap) => {
            if (snap.exists()) {
              dispatch(authSlice.actions.setUserData(normalizeUserData(snap.data() as Partial<UserData>)));
            }
          },
          () => {
            detachUserDocListener();
          }
        );
      } else {
        dispatch(authSlice.actions.setUserData(null));
      }
    } catch (error) {
      dispatch(authSlice.actions.setError(describeFirebaseError(error, "Failed to fetch user data")));
    } finally {
      dispatch(authSlice.actions.setInitializing(false));
    }
  });
});

export const signIn = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      if (error instanceof FirebaseError) return rejectWithValue(await resolveSignInError(error, email));
      return rejectWithValue(describeFirebaseError(error, "An error occurred during sign in"));
    }
  }
);

export const signUp = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const payload = createDefaultUserData(cred.user);
      await setDoc(doc(db, "users", cred.user.uid), payload);
      return cred.user;
    } catch (error) {
      if (error instanceof FirebaseError) return rejectWithValue(await resolveSignUpError(error, email));
      return rejectWithValue(describeFirebaseError(error, "An error occurred during sign up"));
    }
  }
);

export const signInWithGoogle = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      provider.setCustomParameters({ prompt: "select_account" });

      const cred = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const payload = createDefaultUserData(cred.user);
        await setDoc(userRef, payload);
      }
      return cred.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            return rejectWithValue("Sign-in popup was closed. Please try again.");
          case "auth/popup-blocked":
            return rejectWithValue("Popup was blocked. Please allow popups for this site.");
          case "auth/cancelled-popup-request":
            return rejectWithValue("Sign-in was cancelled.");
          case "auth/unauthorized-domain":
            return rejectWithValue("This domain is not authorized. Try again in a few minutes.");
          case "auth/operation-not-allowed":
            return rejectWithValue("Google sign-in is not enabled.");
          case "auth/invalid-api-key":
            return rejectWithValue("Invalid API key configuration.");
          case "auth/network-request-failed":
            return rejectWithValue("Network error. Check your connection and try again.");
          case "auth/account-exists-with-different-credential": {
            const email = (error as any).customData?.email as string | undefined;
            if (email) {
              const methods = await checkExistingSignInMethods(email);
              if (methods.includes("password")) {
                return rejectWithValue(
                  "This email is registered with email/password. Please sign in with email & password."
                );
              }
            }
            return rejectWithValue("An account exists with this email using a different sign-in method.");
          }
          default:
            return rejectWithValue("Google sign-in failed. Please try again.");
        }
      }
      return rejectWithValue(describeFirebaseError(error, "Google sign-in failed. Please try again."));
    }
  }
);

export const signInWithGoogleIdToken = createAsyncThunk<User, string, { rejectValue: string }>(
  "auth/signInWithGoogleIdToken",
  async (idToken, { rejectWithValue }) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const userRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const payload = createDefaultUserData(result.user);
        await setDoc(userRef, payload);
      }
      return result.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            return rejectWithValue("Invalid Google credential.");
          case "auth/operation-not-allowed":
            return rejectWithValue("Google sign-in is not enabled.");
          case "auth/network-request-failed":
            return rejectWithValue("Network error. Please try again.");
          default:
            return rejectWithValue("Google sign-in failed. Please try again.");
        }
      }
      return rejectWithValue(describeFirebaseError(error, "Google sign-in failed. Please try again."));
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error) {
    return rejectWithValue(describeFirebaseError(error, "Failed to log out"));
  }
});

interface ImpersonationPayload {
  user: User;
  userData: UserData;
  userId: string;
}

type AuthThunkConfig = { state: { auth: AuthState }; rejectValue: string };

export const impersonateUser = createAsyncThunk<ImpersonationPayload, string, AuthThunkConfig>(
  "auth/impersonateUser",
  async (userId, { getState, rejectWithValue }) => {
    const state = getState().auth;
    if (!state.user) return rejectWithValue("Must be logged in to impersonate users");

    const isSuperAdmin = state.userData?.role === "super-admin";
    const hasAcceptedRequest = state.userData?.sentRequests?.[userId]?.status === "accepted";
    if (!isSuperAdmin && !hasAcceptedRequest) {
      return rejectWithValue("No permission to impersonate this user");
    }

    try {
      const snap = await getDoc(doc(db, "users", userId));
      if (!snap.exists()) return rejectWithValue("User not found");
      const data = normalizeUserData(snap.data() as Partial<UserData>);
      return { user: createMockUser(userId, data), userData: data, userId };
    } catch (error) {
      return rejectWithValue(describeFirebaseError(error, "Failed to impersonate user"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setUserData(state, action: PayloadAction<UserData | null>) {
      state.userData = action.payload;
    },
    setInitializing(state, action: PayloadAction<boolean>) {
      state.initializing = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    applyImpersonation(state, action: PayloadAction<ImpersonationPayload>) {
      state.impersonatedUser = action.payload.user;
      state.impersonatedUserData = action.payload.userData;
      state.isImpersonating = true;
      if (typeof window !== "undefined") {
        (window as any).__IMPERSONATE_USER_ID__ = action.payload.userId;
      }
    },
    clearImpersonation(state) {
      state.impersonatedUser = null;
      state.impersonatedUserData = null;
      state.isImpersonating = false;
      if (typeof window !== "undefined") {
        (window as any).__IMPERSONATE_USER_ID__ = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "An error occurred during sign in";
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "An error occurred during sign up";
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Google sign-in failed. Please try again.";
      })
      .addCase(signInWithGoogleIdToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleIdToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(signInWithGoogleIdToken.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? action.error.message ?? "Google sign-in failed. Please try again.";
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.userData = null;
        state.error = null;
        state.initializing = false;
        authSlice.caseReducers.clearImpersonation(state);
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to log out";
      })
      .addCase(impersonateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(impersonateUser.fulfilled, (state, action) => {
        state.loading = false;
        authSlice.caseReducers.applyImpersonation(state, action);
        state.error = null;
      })
      .addCase(impersonateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to impersonate user";
      });
  },
});

export const { clearImpersonation: stopImpersonation } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthInitializing = (state: { auth: AuthState }) => state.auth.initializing;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentUserData = (state: { auth: AuthState }) => state.auth.userData;
export const selectImpersonatedUser = (state: { auth: AuthState }) => state.auth.impersonatedUser;
export const selectImpersonatedUserData = (state: { auth: AuthState }) => state.auth.impersonatedUserData;
export const selectEffectiveUser = (state: { auth: AuthState }) =>
  state.auth.impersonatedUser ?? state.auth.user;
export const selectEffectiveUserData = (state: { auth: AuthState }) =>
  state.auth.impersonatedUserData ?? state.auth.userData;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.userData?.role === "admin";
export const selectIsImpersonating = (state: { auth: AuthState }) => state.auth.isImpersonating;

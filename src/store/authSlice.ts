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
import { doc, getDoc, onSnapshot, setDoc, query, collection, where } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import { http } from "@/lib/http";

export const fetchUserDetails = createAsyncThunk<UserData, void, { rejectValue: string }>(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get("/users/me");
      return data;
    } catch (error) {
      return rejectWithValue(describeFirebaseError(error, "Failed to fetch user details"));
    }
  }
);

export interface WorkspaceTarget {
  uid: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENCY" | "USER";
  agencyId?: string;
}

export const fetchWorkspaces = createAsyncThunk<{ workspaces: WorkspaceTarget[] }, void, { rejectValue: string }>(
  "auth/fetchWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get("/users/workspaces");
      return data;
    } catch (error) {
      return rejectWithValue(describeFirebaseError(error, "Failed to fetch workspaces"));
    }
  }
);

type RequestStatus = "pending" | "accepted" | "rejected";
type RequestMap = Record<string, { status: RequestStatus; email: string }>;

export interface UserData {
  name: string;
  email: string;
  role: "ADMIN" | "AGENCY" | "USER";
  agencyId?: string;
  workspaceId?: string;
  isActive: boolean;
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
  batch_calls?: {
    batch_call_id: string;
    agent_id: string;
    agent_name: string;
    call_name: string;
    created_at: string;
    status: string;
  }[];
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  managedUsers: (UserData & { uid: string })[];
  workspaces: WorkspaceTarget[]; // NEW: Available impersonation targets
  impersonatedUser: User | null;
  impersonatedUserData: UserData | null;
  isImpersonating: boolean;
  isImpersonationLoading: boolean; // NEW: Loading state for workspace switching
  loading: boolean;
  initializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userData: null,
  managedUsers: [],
  workspaces: [],
  impersonatedUser: null,
  impersonatedUserData: null,
  isImpersonating: false,
  isImpersonationLoading: false,
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

  // Safely handle role normalization
  let role: "ADMIN" | "AGENCY" | "USER" = "USER";
  if (data.role) {
    const upperRole = data.role.toUpperCase();
    if (upperRole === "ADMIN" || upperRole === "AGENCY" || upperRole === "USER") {
      role = upperRole as "ADMIN" | "AGENCY" | "USER";
    }
  }

  const baseData: Omit<UserData, "agencyId" | "workspaceId"> = {
    name: data.name ?? "",
    email: data.email ?? "",
    role: role,
    isActive: data.isActive ?? true,
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
    batch_calls: data.batch_calls ?? [],
  };

  // Only include agencyId and workspaceId if they have actual values
  // Firestore doesn't support undefined values
  if (data.agencyId !== undefined) {
    (baseData as UserData).agencyId = data.agencyId;
  }
  if (data.workspaceId !== undefined) {
    (baseData as UserData).workspaceId = data.workspaceId;
  }

  return baseData as UserData;
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
    delete: async () => { },
    getIdToken: async () => "",
    getIdTokenResult: async () => ({} as any),
    reload: async () => { },
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
let managedUsersUnsubscribe: (() => void) | null = null;

const detachListeners = () => {
  if (userDocUnsubscribe) {
    userDocUnsubscribe();
    userDocUnsubscribe = null;
  }
  if (managedUsersUnsubscribe) {
    managedUsersUnsubscribe();
    managedUsersUnsubscribe = null;
  }
};

export const initAuthListener = createAsyncThunk("auth/initListener", async (_, { dispatch }) => {
  if (authListenerRegistered) return;
  authListenerRegistered = true;
  authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    dispatch(authSlice.actions.setUser(firebaseUser));
    dispatch(authSlice.actions.setError(null));
    detachListeners();

    if (!firebaseUser) {
      dispatch(authSlice.actions.setUserData(null));
      dispatch(authSlice.actions.setManagedUsers([]));
      dispatch(authSlice.actions.clearImpersonation());
      dispatch(authSlice.actions.setInitializing(false));
      return;
    }

    try {
      const data = await fetchUserData(firebaseUser.uid);
      if (data) {
        dispatch(authSlice.actions.setUserData(data));

        // Restore persistent impersonation if it exists
        const persistedImpId = localStorage.getItem("XUNA_IMPERSONATED_USER_ID");
        if (persistedImpId) {
          console.log('[initAuthListener] Restoring persistent impersonation for:', persistedImpId);
          dispatch(impersonateUser(persistedImpId));
        }

        if (data.role === "AGENCY" || data.role === "ADMIN") {
          dispatch(fetchWorkspaces());
        } else {
          dispatch(authSlice.actions.setWorkspaces([]));
        }

        userDocUnsubscribe = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (snap) => {
            if (snap.exists()) {
              const updatedData = normalizeUserData(snap.data() as Partial<UserData>);
              dispatch(authSlice.actions.setUserData(updatedData));

              // Handle role change scenario (e.g. upgraded to AGENCY)
              if ((updatedData.role === "AGENCY" || updatedData.role === "ADMIN")) {
                dispatch(fetchWorkspaces());
              } else {
                dispatch(authSlice.actions.setWorkspaces([]));
              }
            }
          },
          () => {
            detachListeners();
          }
        );
      } else {
        dispatch(authSlice.actions.setUserData(null));
        dispatch(authSlice.actions.setManagedUsers([]));
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

export const signUp = createAsyncThunk<User, { email: string; password: string; name: string }, { rejectValue: string }>(
  "auth/signUp",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      console.log('[SignUp] Starting signup process for:', email);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[SignUp] User created in Authentication:', cred.user.uid);

      const payload = createDefaultUserData(cred.user);
      payload.name = name; // Set the name provided during signup
      console.log('[SignUp] User data payload:', payload);

      try {
        await setDoc(doc(db, "users", cred.user.uid), payload);
        console.log('[SignUp] ✅ Firestore document created successfully');
      } catch (firestoreError) {
        console.error('[SignUp] ❌ Firestore write failed:', firestoreError);
        // Even if Firestore fails, we return the user (they're authenticated)
        // The auth listener will try to fetch the doc and handle missing data
      }

      return cred.user;
    } catch (error) {
      console.error('[SignUp] Error during signup:', error);
      if (error instanceof FirebaseError) return rejectWithValue(await resolveSignUpError(error, email));
      return rejectWithValue(describeFirebaseError(error, "An error occurred during sign up"));
    }
  }
);

export const signInWithGoogle = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      console.log('[GoogleSignIn] Starting Google sign-in');
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      provider.setCustomParameters({ prompt: "select_account" });

      const cred = await signInWithPopup(auth, provider);
      console.log('[GoogleSignIn] User authenticated:', cred.user.uid);

      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        console.log('[GoogleSignIn] No Firestore doc found, creating new user document');
        const payload = createDefaultUserData(cred.user);
        console.log('[GoogleSignIn] User data payload:', payload);

        try {
          await setDoc(userRef, payload);
          console.log('[GoogleSignIn] ✅ Firestore document created successfully');
        } catch (firestoreError) {
          console.error('[GoogleSignIn] ❌ Firestore write failed:', firestoreError);
        }
      } else {
        console.log('[GoogleSignIn] Existing user found in Firestore');
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
    console.log('[impersonateUser] Starting impersonation for:', userId);
    const state = getState().auth;
    if (!state.user) {
      console.log('[impersonateUser] ❌ No user logged in');
      return rejectWithValue("Must be logged in to impersonate users");
    }

    const currentRole = state.userData?.role;
    const currentUid = state.user.uid;

    console.log('[impersonateUser] Current user:', { uid: currentUid, role: currentRole });

    try {
      // Fetch the target user's data
      const snap = await getDoc(doc(db, "users", userId));
      if (!snap.exists()) {
        console.log('[impersonateUser] ❌ User not found:', userId);
        return rejectWithValue("User not found");
      }

      const targetUserData = normalizeUserData(snap.data() as Partial<UserData>);
      console.log('[impersonateUser] Target user data:', targetUserData);

      // Permission check based on RBAC hierarchy
      if (currentRole === "ADMIN") {
        // ADMIN can impersonate anyone
        console.log('[impersonateUser] ✅ ADMIN can impersonate anyone');
      } else if (currentRole === "AGENCY") {
        // AGENCY can only impersonate users where agencyId matches current user's UID
        if (targetUserData.agencyId !== currentUid) {
          console.log('[impersonateUser] ❌ AGENCY cannot impersonate user from different agency');
          console.log('[impersonateUser] Target agencyId:', targetUserData.agencyId, 'Current UID:', currentUid);
          return rejectWithValue("User is not in your agency");
        }
        console.log('[impersonateUser] ✅ AGENCY can impersonate managed user');
      } else {
        // Regular USER cannot impersonate
        console.log('[impersonateUser] ❌ USER role cannot impersonate');
        return rejectWithValue("No permission to impersonate users");
      }

      const payload = { user: createMockUser(userId, targetUserData), userData: targetUserData, userId };
      console.log('[impersonateUser] ✅ Impersonation successful');
      return payload;
    } catch (error) {
      console.error('[impersonateUser] ❌ Error:', error);
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
    setManagedUsers(state, action: PayloadAction<(UserData & { uid: string })[]>) {
      state.managedUsers = action.payload;
    },
    setWorkspaces(state, action: PayloadAction<WorkspaceTarget[]>) {
      state.workspaces = action.payload;
    },
    applyImpersonation(state, action: PayloadAction<ImpersonationPayload>) {
      state.impersonatedUser = action.payload.user;
      state.impersonatedUserData = action.payload.userData;
      state.isImpersonating = true;
      if (typeof window !== "undefined") {
        (window as any).__IMPERSONATE_USER_ID__ = action.payload.userId;
        localStorage.setItem("XUNA_IMPERSONATED_USER_ID", action.payload.userId);
      }
    },
    clearImpersonation(state) {
      state.impersonatedUser = null;
      state.impersonatedUserData = null;
      state.isImpersonating = false;
      if (typeof window !== "undefined") {
        (window as any).__IMPERSONATE_USER_ID__ = undefined;
        localStorage.removeItem("XUNA_IMPERSONATED_USER_ID");
      }
    },
    setIsImpersonationLoading(state, action: PayloadAction<boolean>) {
      state.isImpersonationLoading = action.payload;
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
        state.isImpersonationLoading = true;
        state.error = null;
      })
      .addCase(impersonateUser.fulfilled, (state, action) => {
        // We DON'T set isImpersonationLoading to false here 
        // because we want to wait for API syncing (agents, etc) 
        // to complete in the components.
        authSlice.caseReducers.applyImpersonation(state, action);
        state.error = null;
      })
      .addCase(impersonateUser.rejected, (state, action) => {
        state.isImpersonationLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to impersonate user";
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = normalizeUserData(action.payload);
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to fetch user details";
      })
      .addCase(fetchWorkspaces.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.workspaces = action.payload.workspaces;
        state.error = null;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to fetch workspaces";
      });
  },
});

export const { clearImpersonation: stopImpersonation, setIsImpersonationLoading } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthInitializing = (state: { auth: AuthState }) => state.auth.initializing;
export const selectManagedUsers = (state: { auth: AuthState }) => state.auth.managedUsers;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentUserData = (state: { auth: AuthState }) => state.auth.userData;
export const selectIsImpersonating = (state: { auth: AuthState }) => state.auth.isImpersonating;
export const selectWorkspaces = (state: { auth: AuthState }) => state.auth.workspaces;
export const selectIsImpersonationLoading = (state: { auth: AuthState }) => state.auth.isImpersonationLoading;
export const selectImpersonatedUser = (state: { auth: AuthState }) => state.auth.impersonatedUser;
export const selectImpersonatedUserData = (state: { auth: AuthState }) => state.auth.impersonatedUserData;
export const selectEffectiveUser = (state: { auth: AuthState }) =>
  state.auth.impersonatedUser ?? state.auth.user;
export const selectEffectiveUserData = (state: { auth: AuthState }) =>
  state.auth.impersonatedUserData ?? state.auth.userData;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.userData?.role === "ADMIN";
export const selectIsAgency = (state: { auth: AuthState }) => state.auth.userData?.role === "AGENCY";

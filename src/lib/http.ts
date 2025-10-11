import axios from "axios";
import { auth } from "@/lib/firebase";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
});

http.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  const imp = (window as any).__IMPERSONATE_USER_ID__ as string | undefined;
  if (imp) (config.headers as any)["X-Impersonate-User"] = imp;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

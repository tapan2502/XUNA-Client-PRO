import axios, { AxiosHeaders } from "axios";
import { auth } from "@/lib/firebase";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
});

http.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers ?? {});

  if (user) {
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }
  const imp =
    typeof window !== "undefined"
      ? ((window as any).__IMPERSONATE_USER_ID__ as string | undefined)
      : undefined;
  if (imp) headers.set("X-Impersonate-User", imp);

  config.headers = headers;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

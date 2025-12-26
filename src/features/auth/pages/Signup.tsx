"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { signUp, signInWithGoogle } from "@/store/authSlice";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function Signup() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const passwordsMismatch = useMemo(
    () => confirmPassword.length > 0 && password !== confirmPassword,
    [password, confirmPassword]
  );

  const disabled =
    loading ||
    !name.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim() ||
    passwordsMismatch;

  const onSubmit = () =>
    dispatch(signUp({ email: email.trim(), password: password.trim(), name: name.trim() }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-foreground flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">


          <div className="flex justify-center mb-6">
            <img src={logo} alt="XUNA Logo" className="h-24 w-auto object-contain invert dark:invert-0" />
          </div>
          <h2 className="mt-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Start your journey with Xuna
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900/60 shadow-xl border border-neutral-200/70 dark:border-white/10 backdrop-blur-md p-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!disabled) onSubmit();
            }}
          >
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-10 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-10 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-10 py-2.5 pr-11 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full rounded-xl border bg-white dark:bg-neutral-800 px-10 py-2.5 pr-11 text-sm outline-none transition
                    ${passwordsMismatch
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-300/60 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/30"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-xs text-rose-500">Passwords do not match.</p>
              )}
            </div>

            {/* Create account */}
            <button
              type="submit"
              disabled={disabled}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <UserPlus className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700" />
              <span className="absolute bg-white dark:bg-neutral-900 px-3 text-xs text-neutral-500 uppercase tracking-wide">
                Or continue with
              </span>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => dispatch(signInWithGoogle())}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:opacity-80"
              >
                Sign in <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>

            {/* SR-only live region */}
            <span className="sr-only" aria-live="polite" role="status">
              {loading ? "Creating account" : ""}
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

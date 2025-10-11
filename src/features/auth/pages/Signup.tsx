"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, Input, Button, Divider } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { signUp, signInWithGoogle } from "@/store/authSlice"
import { Link } from "react-router-dom"
import { Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function Signup() {
  const d = useAppDispatch()
  const loading = useAppSelector((s) => s.auth.loading)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const hadDarkClass = root.classList.contains("dark")
    root.classList.remove("dark")

    return () => {
      if (hadDarkClass) {
        root.classList.add("dark")
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gray-900">X</span>
            <span className="text-purple-600">UNA</span>
          </h1>
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Create your account</h2>
          <p className="text-gray-600 text-sm">Start your journey with Xuna</p>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardBody className="gap-6 p-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onValueChange={setEmail}
                startContent={<Mail className="w-4 h-4 text-gray-400" />}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-gray-50 border-gray-200 hover:bg-gray-100",
                }}
                size="lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onValueChange={setPassword}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                endContent={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-gray-50 border-gray-200 hover:bg-gray-100",
                }}
                size="lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-gray-50 border-gray-200 hover:bg-gray-100",
                }}
                size="lg"
              />
            </div>

            <Button
              size="lg"
              isLoading={loading}
              isDisabled={!email || !password || password !== confirmPassword}
              onPress={() => d(signUp({ email, password }))}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              endContent={!loading && <UserPlus className="w-4 h-4" />}
            >
              Create account
            </Button>

            <div className="relative my-2">
              <Divider className="bg-gray-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                Or continue with
              </span>
            </div>

            <Button
              variant="bordered"
              size="lg"
              onPress={() => d(signInWithGoogle())}
              className="w-full border-gray-300 hover:bg-gray-50 font-medium"
              startContent={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              }
            >
              <span className="text-gray-700">Sign up with Google</span>
            </Button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:text-purple-700 inline-flex items-center gap-1"
              >
                Sign in
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

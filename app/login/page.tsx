// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// export default function LoginPage() {
//   const router = useRouter();

//   const handleLogin = async (role: string) => {
//     // ✅ Replace this with real backend auth
//     Cookies.set("authToken", "dummy-token", { expires: 1 });
//     Cookies.set("userRole", role, { expires: 1 });

//     if (role === "patient") router.push("/patient/dashboard");
//     if (role === "doctor") router.push("/doctor/dashboard");
//     if (role === "receptionist") router.push("/receptionist/dashboard");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-xl font-bold">Login</h1>
//       <button
//         onClick={() => handleLogin("patient")}
//         className="px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         Login as Patient
//       </button>
//       <button
//         onClick={() => handleLogin("doctor")}
//         className="px-4 py-2 bg-green-600 text-white rounded mt-2"
//       >
//         Login as Doctor
//       </button>
//       <button
//         onClick={() => handleLogin("receptionist")}
//         className="px-4 py-2 bg-purple-600 text-white rounded mt-2"
//       >
//         Login as Receptionist
//       </button>
//     </div>
//   );
// }














































"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, EyeOff } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      const result = await response.json()

      if (response.ok) {
        // Assuming your login function handles storing the user/token
        login(result.user)

        // Redirect based on role
        switch (result.user.role) {
          case "patient":
            router.push("/patient/dashboard")
            break
          case "doctor":
            router.push("/doctor/dashboard")
            break
          case "receptionist":
            router.push("/receptionist/dashboard")
            break
        }
      } else {
        setError(result.message || "An unknown error occurred.")
      }
    } catch (err) {
      setError("Could not connect to the server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-foreground">
            <Heart className="h-8 w-8 text-primary" />
            <span>DOC C+</span>
          </Link>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md border border-red-400 bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ChatbotWidget />
    </div>
  )
}

// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // Schemas for each role
// const patientSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email"),
//   age: z.number().min(1, "Age required"),
//   location: z.string().min(2, "Location required"),
//   weight: z.number().min(1, "Weight required"),
//   password: z.string().min(6, "Min 6 characters"),
// });

// const doctorSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   hospital: z.string().min(2),
//   location: z.string().min(2),
//   specialist: z.string().min(2),
//   password: z.string().min(6),
// });

// const receptionistSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   hospital: z.string().min(2),
//   location: z.string().min(2),
//   password: z.string().min(6),
// });

// export default function RegisterPage() {
//   const [role, setRole] = useState<"patient" | "doctor" | "receptionist">("patient");

//   const schema =
//     role === "patient" ? patientSchema : role === "doctor" ? doctorSchema : receptionistSchema;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(schema) });

//   const onSubmit = (data: any) => {
//     console.log("Register Data:", { role, ...data });
//     alert(`${role} registered successfully!`);
//     // later: call Supabase API here
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-4">Register as {role}</h1>

//         {/* Role Switch */}
//         <div className="flex justify-around mb-4">
//           {["patient", "doctor", "receptionist"].map((r) => (
//             <button
//               key={r}
//               onClick={() => setRole(r as any)}
//               className={`px-3 py-1 rounded-lg ${
//                 role === r ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//             >
//               {r}
//             </button>
//           ))}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           <input placeholder="Name" {...register("name")} className="input" />
//           {errors.name && <p className="text-red-500">{`${errors.name.message}`}</p>}

//           <input placeholder="Email" {...register("email")} className="input" />
//           {errors.email && <p className="text-red-500">{`${errors.email.message}`}</p>}

//           {role === "patient" && (
//             <>
//               <input
//                 type="number"
//                 placeholder="Age"
//                 {...register("age", { valueAsNumber: true })}
//                 className="input"
//               />
//               <input placeholder="Location" {...register("location")} className="input" />
//               <input
//                 type="number"
//                 placeholder="Weight"
//                 {...register("weight", { valueAsNumber: true })}
//                 className="input"
//               />
//             </>
//           )}

//           {role === "doctor" && (
//             <>
//               <input placeholder="Hospital Name" {...register("hospital")} className="input" />
//               <input placeholder="Location" {...register("location")} className="input" />
//               <input placeholder="Specialist" {...register("specialist")} className="input" />
//             </>
//           )}

//           {role === "receptionist" && (
//             <>
//               <input placeholder="Hospital Name" {...register("hospital")} className="input" />
//               <input placeholder="Location" {...register("location")} className="input" />
//             </>
//           )}

//           <input
//             type="password"
//             placeholder="Password"
//             {...register("password")}
//             className="input"
//           />
//           {errors.password && <p className="text-red-500">{`${errors.password.message}`}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }





















































"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, EyeOff } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    age: "",
    location: "",
    weight: "",
    hospitalName: "",
    specialistCategory: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Registration successful! Please login.")
        router.push("/login")
      } else {
        setError(result.message || "An error occurred during registration.")
      }
    } catch (err) {
      console.error("Registration failed:", err)
      setError("Could not connect to the server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "patient":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )
      case "doctor":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                placeholder="Enter hospital name"
                value={formData.hospitalName}
                onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialistCategory">Specialist Category</Label>
              <Select
                value={formData.specialistCategory}
                onValueChange={(value) => handleInputChange("specialistCategory", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="neurologist">Neurologist</SelectItem>
                  <SelectItem value="orthopedic">Orthopedic</SelectItem>
                  <SelectItem value="pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                  <SelectItem value="general">General Practitioner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "receptionist":
        return (
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input
              id="hospitalName"
              placeholder="Enter hospital name"
              value={formData.hospitalName}
              onChange={(e) => handleInputChange("hospitalName", e.target.value)}
              required
            />
          </div>
        )
      default:
        return null
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
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Fill in your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md border border-red-400 bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} required>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              {renderRoleSpecificFields()}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in here
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






// --------------------------
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Heart, Eye, EyeOff } from "lucide-react"
// import { ChatbotWidget } from "@/components/chatbot-widget"

// // 🔹 Schema for validation
// const schema = z
//   .object({
//     role: z.enum(["patient", "doctor", "receptionist"], { required_error: "Role is required" }),
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Invalid email"),
//     location: z.string().min(2, "Location required"),
//     age: z.string().optional(),
//     weight: z.string().optional(),
//     hospitalName: z.string().optional(),
//     specialistCategory: z.string().optional(),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   })

// type FormData = z.infer<typeof schema>

// export default function RegisterPage() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>({ resolver: zodResolver(schema) })

//   // Set role from query param if exists
//   useEffect(() => {
//     const roleParam = searchParams.get("role")
//     if (roleParam) {
//       setValue("role", roleParam as "patient" | "doctor" | "receptionist")
//     }
//   }, [searchParams, setValue])

//   const role = watch("role")

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true)
//     setTimeout(() => {
//       alert(`${data.role} registered successfully!`)
//       router.push("/login")
//       setIsLoading(false)
//     }, 1000)
//   }

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-foreground">
//             <Heart className="h-8 w-8 text-primary" />
//             <span>DOC C+</span>
//           </Link>
//           <p className="text-muted-foreground mt-2">Create your account</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Register</CardTitle>
//             <CardDescription>Fill in your details to create an account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {/* Role */}
//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Select onValueChange={(val) => setValue("role", val as any)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select your role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="patient">Patient</SelectItem>
//                     <SelectItem value="doctor">Doctor</SelectItem>
//                     <SelectItem value="receptionist">Receptionist</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
//               </div>

//               {/* Common fields */}
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" placeholder="Enter your full name" {...register("name")} />
//                 {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
//                 {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Input id="location" placeholder="Enter your location" {...register("location")} />
//                 {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//               </div>

//               {/* Role-specific */}
//               {role === "patient" && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="age">Age</Label>
//                     <Input id="age" type="number" {...register("age")} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="weight">Weight (kg)</Label>
//                     <Input id="weight" type="number" {...register("weight")} />
//                   </div>
//                 </div>
//               )}

//               {role === "doctor" && (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="hospitalName">Hospital Name</Label>
//                     <Input id="hospitalName" {...register("hospitalName")} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="specialistCategory">Specialist Category</Label>
//                     <Input id="specialistCategory" {...register("specialistCategory")} />
//                   </div>
//                 </>
//               )}

//               {role === "receptionist" && (
//                 <div className="space-y-2">
//                   <Label htmlFor="hospitalName">Hospital Name</Label>
//                   <Input id="hospitalName" {...register("hospitalName")} />
//                 </div>
//               )}

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a password"
//                     {...register("password")}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     {...register("confirmPassword")}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
//                 )}
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating account..." : "Create Account"}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-muted-foreground">
//                 Already have an account?{" "}
//                 <Link href="/login" className="text-primary hover:underline">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <ChatbotWidget />
//     </div>
//   )
// }

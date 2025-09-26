"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Building2 } from "lucide-react"

export default function ReceptionistProfilePage() {
  const { toast } = useToast()
  const [photoUrl, setPhotoUrl] = useState("/placeholder-user.jpg")
  const [name, setName] = useState("Maria Rodriguez")
  const [hospital, setHospital] = useState("City General Hospital")
  const [location, setLocation] = useState("Downtown")

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoUrl(url)
  }

  const onSave = () => {
    toast({ title: "Profile saved", description: "Receptionist profile has been updated." })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/receptionist/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Update your details</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Personal Details
              </CardTitle>
              <CardDescription>Your information used across the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={photoUrl} alt="Profile photo" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={onUpload} />
                  <p className="text-xs text-muted-foreground">Upload JPG or PNG</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital Name</Label>
                <Input id="hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="flex justify-end">
                <Button onClick={onSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
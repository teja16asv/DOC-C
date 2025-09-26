import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">DOC C+</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Modern Healthcare Management System
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Streamline your healthcare experience with our comprehensive platform designed for patients, doctors, and
            healthcare staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Choose Your Role</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Patient Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Patient Portal</CardTitle>
                <CardDescription>Book appointments, view prescriptions, and manage your health history</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/register?role=patient">
                  <Button className="w-full">Register as Patient</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>Doctor Dashboard</CardTitle>
                <CardDescription>Manage patients, appointments, and prescriptions efficiently</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/register?role=doctor">
                  <Button variant="secondary" className="w-full">
                    Register as Doctor
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Receptionist Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Receptionist Panel</CardTitle>
                <CardDescription>Handle appointments, manage schedules, and assist patients</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/register?role=receptionist">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register as Receptionist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">DOC C+</span>
          </div>
          <p className="text-muted-foreground">© 2024 DOC C+. All rights reserved. Your health, our priority.</p>
        </div>
      </footer>
    </div>
  )
}

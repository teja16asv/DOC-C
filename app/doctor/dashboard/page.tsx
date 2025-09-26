"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, FileText, Settings, Heart, User, Bell } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

// Mock data
const mockStats = {
  todayPatients: 8,
  upcomingAppointments: 12,
  totalPatients: 156,
  pendingPrescriptions: 3,
}

const mockTodayAppointments = [
  {
    id: 1,
    patient: "John Doe",
    time: "9:00 AM",
    condition: "Hypertension Follow-up",
    status: "Confirmed",
    type: "Follow-up",
  },
  {
    id: 2,
    patient: "Sarah Wilson",
    time: "10:30 AM",
    condition: "Chest Pain Consultation",
    status: "Confirmed",
    type: "Consultation",
  },
  {
    id: 3,
    patient: "Michael Brown",
    time: "2:00 PM",
    condition: "Routine Check-up",
    status: "Pending",
    type: "Check-up",
  },
  {
    id: 4,
    patient: "Emily Davis",
    time: "3:30 PM",
    condition: "Medication Review",
    status: "Confirmed",
    type: "Follow-up",
  },
]

const mockUpcomingAppointments = [
  {
    id: 5,
    patient: "Robert Johnson",
    date: "2024-01-16",
    time: "11:00 AM",
    condition: "Annual Physical",
    type: "Check-up",
  },
  {
    id: 6,
    patient: "Lisa Anderson",
    date: "2024-01-17",
    time: "9:30 AM",
    condition: "Blood Pressure Check",
    type: "Follow-up",
  },
]

export default function DoctorDashboard() {
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Dr. Sarah Johnson</span>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                <Link href="/doctor/profile">Profile</Link>
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Patients</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.todayPatients}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.upcomingAppointments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.totalPatients}</p>
                    </div>
                    <User className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Scripts</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.pendingPrescriptions}</p>
                    </div>
                    <FileText className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>Your scheduled appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTodayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        <Badge variant="outline">{appointment.type}</Badge>
                        <Link href={`/doctor/patient/${appointment.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/doctor/appointments">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Appointments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next few days schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUpcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <div>
                          <p className="font-medium text-foreground">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.date}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/doctor/appointments">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Appointments
                  </Button>
                </Link>
                <Link href="/doctor/prescriptions">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Write Prescription
                  </Button>
                </Link>
                <Link href="/doctor/availability">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                </Link>
                <Link href="/doctor/patients">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Patient List
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Today's Schedule Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">First Appointment</span>
                  <span className="text-sm font-medium">9:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Appointment</span>
                  <span className="text-sm font-medium">3:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Patients</span>
                  <span className="text-sm font-medium">{mockStats.todayPatients}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Remember to update patient records after each visit</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

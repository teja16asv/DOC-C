"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  FileText,
  Search,
  Filter,
  Heart,
  User,
  Bell,
  Phone,
  Mail,
} from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

// Mock data
const mockStats = {
  todayAppointments: 24,
  totalDoctors: 8,
  pendingPayments: 12,
  totalRevenue: 4850,
}

const mockAppointments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "9:00 AM",
    type: "Consultation",
    status: "Confirmed",
    fee: 150,
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    patient: "Sarah Wilson",
    doctor: "Dr. Michael Chen",
    date: "2024-01-15",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Pending",
    fee: 100,
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    patient: "Michael Brown",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-01-15",
    time: "2:00 PM",
    type: "Check-up",
    status: "Confirmed",
    fee: 120,
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    patient: "Emily Davis",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-16",
    time: "11:00 AM",
    type: "Consultation",
    status: "Cancelled",
    fee: 150,
    phone: "(555) 456-7890",
  },
]

const mockDoctors = ["All Doctors", "Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez", "Dr. Robert Wilson"]

export default function ReceptionistDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors")
  const [selectedDate, setSelectedDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDoctor = selectedDoctor === "All Doctors" || appointment.doctor === selectedDoctor
    const matchesDate = !selectedDate || appointment.date === selectedDate
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter

    return matchesSearch && matchesDoctor && matchesDate && matchesStatus
  })

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
              <span className="text-sm text-muted-foreground">Maria Rodriguez</span>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                <Link href="/receptionist/profile">Profile</Link>
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
                      <p className="text-sm text-muted-foreground">Today's Appointments</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.todayAppointments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Doctors</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.totalDoctors}</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Payments</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.pendingPayments}</p>
                    </div>
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Revenue</p>
                      <p className="text-2xl font-bold text-foreground">${mockStats.totalRevenue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Appointment Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search patients or doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
                <CardDescription>Manage all doctor appointments from one place</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{appointment.patient}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">${appointment.fee}</p>
                            <Badge
                              variant={
                                appointment.status === "Confirmed"
                                  ? "default"
                                  : appointment.status === "Pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Appointments Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedDoctor !== "All Doctors" || selectedDate || statusFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "No appointments scheduled for today."}
                    </p>
                  </div>
                )}
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
                <Link href="/receptionist/book-appointment">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/receptionist/payments">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Payments
                  </Button>
                </Link>
                <Link href="/receptionist/reports">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
                <Link href="/receptionist/patients">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Patient Directory
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Confirmed</span>
                  <span className="text-sm font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-sm font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="text-sm font-medium">${mockStats.totalRevenue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Reminders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground">Follow up with John Doe</p>
                  <p className="text-muted-foreground">Reschedule cancelled appointment</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Payment pending</p>
                  <p className="text-muted-foreground">Sarah Wilson - $100</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Insurance verification</p>
                  <p className="text-muted-foreground">3 patients need verification</p>
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

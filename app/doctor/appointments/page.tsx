"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock, Search, Filter, User } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const mockAppointments = [
  {
    id: 1,
    patient: "John Doe",
    date: "2024-01-15",
    time: "9:00 AM",
    condition: "Hypertension Follow-up",
    status: "Confirmed",
    type: "Follow-up",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    patient: "Sarah Wilson",
    date: "2024-01-15",
    time: "10:30 AM",
    condition: "Chest Pain Consultation",
    status: "Confirmed",
    type: "Consultation",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    patient: "Michael Brown",
    date: "2024-01-15",
    time: "2:00 PM",
    condition: "Routine Check-up",
    status: "Pending",
    type: "Check-up",
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    patient: "Emily Davis",
    date: "2024-01-16",
    time: "11:00 AM",
    condition: "Medication Review",
    status: "Confirmed",
    type: "Follow-up",
    phone: "(555) 456-7890",
  },
  {
    id: 5,
    patient: "Robert Johnson",
    date: "2024-01-17",
    time: "9:30 AM",
    condition: "Annual Physical",
    status: "Confirmed",
    type: "Check-up",
    phone: "(555) 567-8901",
  },
]

export default function DoctorAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || appointment.type.toLowerCase() === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/doctor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
              <p className="text-muted-foreground">View and manage your patient appointments</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients or conditions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="check-up">Check-up</SelectItem>
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
              <CardDescription>Manage your patient appointments</CardDescription>
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
                          <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                          <p className="text-sm text-muted-foreground">{appointment.phone}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        <Badge variant="outline">{appointment.type}</Badge>
                        <div className="flex gap-2">
                          <Link href={`/doctor/patient/${appointment.id}`}>
                            <Button variant="outline" size="sm">
                              View Patient
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Reschedule
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
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "You don't have any appointments scheduled yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ArrowLeft, Check } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

const mockDoctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
  { id: "2", name: "Dr. Michael Chen", specialty: "General Practitioner" },
  { id: "3", name: "Dr. Emily Rodriguez", specialty: "Dermatologist" },
]

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("doctor")

  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || "")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [isBooked, setIsBooked] = useState(false)

  const handleBooking = () => {
    if (selectedDoctor && selectedDate && selectedTime && appointmentType) {
      setIsBooked(true)
    }
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-secondary">Appointment Booked!</CardTitle>
            <CardDescription>Your appointment has been successfully scheduled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-2 p-4 bg-muted rounded-lg">
              <p>
                <strong>Doctor:</strong> {mockDoctors.find((d) => d.id === selectedDoctor)?.name}
              </p>
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Type:</strong> {appointmentType}
              </p>
            </div>
            <Link href="/patient/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
        <ChatbotWidget />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">{/* enlarged layout */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/patient/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Book Appointment</h1>
              <p className="text-muted-foreground">Schedule your visit with a healthcare professional</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment Details
              </CardTitle>
              <CardDescription>Please fill in the details to book your appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor is preselected via previous step; hide dropdown */}
              {selectedDoctor && (
                <div className="text-sm text-muted-foreground">
                  Booking with <span className="font-medium text-foreground">{mockDoctors.find((d) => d.id === selectedDoctor)?.name}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="check-up">Regular Check-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="appointment-date" className="text-sm font-medium">Select Date</label>
                  <input
                    type="date"
                    id="appointment-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentType}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

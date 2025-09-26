"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, User, Check } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const mockDoctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiologist", fee: 150 },
  { id: "2", name: "Dr. Michael Chen", specialty: "General Practitioner", fee: 100 },
  { id: "3", name: "Dr. Emily Rodriguez", specialty: "Dermatologist", fee: 120 },
  { id: "4", name: "Dr. Robert Wilson", specialty: "Orthopedic", fee: 180 },
]

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

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "",
    notes: "",
    paymentMethod: "",
  })
  const [isBooked, setIsBooked] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooked(true)
  }

  const selectedDoctor = mockDoctors.find((d) => d.id === formData.doctorId)

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-secondary">Appointment Booked Successfully!</CardTitle>
            <CardDescription>The appointment has been scheduled and confirmation sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-2 p-4 bg-muted rounded-lg">
              <p>
                <strong>Patient:</strong> {formData.patientName}
              </p>
              <p>
                <strong>Doctor:</strong> {selectedDoctor?.name}
              </p>
              <p>
                <strong>Date:</strong> {formData.appointmentDate}
              </p>
              <p>
                <strong>Time:</strong> {formData.appointmentTime}
              </p>
              <p>
                <strong>Fee:</strong> ${selectedDoctor?.fee}
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Send Confirmation</Button>
              <Link href="/receptionist/book-appointment">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Book Another
                </Button>
              </Link>
            </div>
            <Link href="/receptionist/dashboard">
              <Button variant="ghost" className="w-full">
                Back to Dashboard
              </Button>
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/receptionist/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Book New Appointment</h1>
              <p className="text-muted-foreground">Schedule an appointment for a patient</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient's full name"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Phone Number</Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.patientPhone}
                      onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Email Address</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="patient@email.com"
                      value={formData.patientEmail}
                      onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorId">Select Doctor</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => handleInputChange("doctorId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty} (${doctor.fee})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(value) => handleInputChange("appointmentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">New Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                      <SelectItem value="check-up">Regular Check-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Date</Label>
                    <input
                      type="date"
                      id="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Time</Label>
                    <Select
                      value={formData.appointmentTime}
                      onValueChange={(value) => handleInputChange("appointmentTime", value)}
                    >
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

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fee Summary */}
            {selectedDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>Fee Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <span className="font-medium">Consultation Fee</span>
                    <span className="text-lg font-bold text-primary">${selectedDoctor.fee}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                !formData.patientName ||
                !formData.patientPhone ||
                !formData.doctorId ||
                !formData.appointmentDate ||
                !formData.appointmentTime ||
                !formData.appointmentType
              }
            >
              Book Appointment
            </Button>
          </form>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

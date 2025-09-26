"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Clock, Calendar, Save } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
]

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, startTime: "9:00 AM", endTime: "5:00 PM" },
    tuesday: { enabled: true, startTime: "9:00 AM", endTime: "5:00 PM" },
    wednesday: { enabled: true, startTime: "9:00 AM", endTime: "5:00 PM" },
    thursday: { enabled: true, startTime: "9:00 AM", endTime: "5:00 PM" },
    friday: { enabled: true, startTime: "9:00 AM", endTime: "5:00 PM" },
    saturday: { enabled: false, startTime: "9:00 AM", endTime: "1:00 PM" },
    sunday: { enabled: false, startTime: "9:00 AM", endTime: "1:00 PM" },
  })

  const [appointmentDuration, setAppointmentDuration] = useState("30")
  const [bufferTime, setBufferTime] = useState("15")
  const [isSaved, setIsSaved] = useState(false)

  const updateAvailability = (day: string, field: string, value: any) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/doctor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Availability</h1>
              <p className="text-muted-foreground">Set your working hours and appointment preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Appointment Settings
                </CardTitle>
                <CardDescription>Configure your appointment duration and buffer times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Appointment Duration</Label>
                    <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Time Between Appointments</Label>
                    <Select value={bufferTime} onValueChange={setBufferTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>Set your working hours for each day of the week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="w-24">
                      <Label className="font-medium">{day.label}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={availability[day.key as keyof typeof availability].enabled}
                        onCheckedChange={(checked) => updateAvailability(day.key, "enabled", checked)}
                      />
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                    {availability[day.key as keyof typeof availability].enabled && (
                      <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">From:</Label>
                          <Select
                            value={availability[day.key as keyof typeof availability].startTime}
                            onValueChange={(value) => updateAvailability(day.key, "startTime", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">To:</Label>
                          <Select
                            value={availability[day.key as keyof typeof availability].endTime}
                            onValueChange={(value) => updateAvailability(day.key, "endTime", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="min-w-32">
                {isSaved ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

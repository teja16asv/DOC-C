"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, FileText, Activity } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const mockHealthHistory = [
  {
    id: 1,
    date: "2024-01-10",
    doctor: "Dr. Sarah Johnson",
    type: "Consultation",
    diagnosis: "Hypertension Management",
    notes: "Blood pressure elevated. Started on Lisinopril. Follow-up in 4 weeks.",
    vitals: { bp: "140/90", weight: "75kg", temp: "98.6°F" },
  },
  {
    id: 2,
    date: "2023-12-15",
    doctor: "Dr. Michael Chen",
    type: "Follow-up",
    diagnosis: "Upper Respiratory Infection",
    notes: "Symptoms improved with antibiotics. Continue rest and hydration.",
    vitals: { bp: "120/80", weight: "74kg", temp: "99.2°F" },
  },
  {
    id: 3,
    date: "2023-11-20",
    doctor: "Dr. Emily Rodriguez",
    type: "Consultation",
    diagnosis: "Eczema Treatment",
    notes: "Mild eczema on arms. Prescribed topical corticosteroid.",
    vitals: { bp: "118/78", weight: "74kg", temp: "98.4°F" },
  },
  {
    id: 4,
    date: "2023-10-05",
    doctor: "Dr. Sarah Johnson",
    type: "Annual Check-up",
    diagnosis: "Routine Physical Examination",
    notes: "Overall health good. Recommended lifestyle modifications for blood pressure.",
    vitals: { bp: "135/85", weight: "73kg", temp: "98.6°F" },
  },
]

export default function HealthHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/patient/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health History</h1>
              <p className="text-muted-foreground">Your complete medical timeline and visit records</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-8">
              {mockHealthHistory.map((visit, index) => (
                <div key={visit.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>

                  {/* Content */}
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            {visit.type}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(visit.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {visit.doctor}
                              </div>
                            </div>
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{visit.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Diagnosis</h4>
                          <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground">{visit.notes}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2">Vitals</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-2 bg-muted/30 rounded">
                              <p className="text-xs text-muted-foreground">Blood Pressure</p>
                              <p className="font-medium">{visit.vitals.bp}</p>
                            </div>
                            <div className="text-center p-2 bg-muted/30 rounded">
                              <p className="text-xs text-muted-foreground">Weight</p>
                              <p className="font-medium">{visit.vitals.weight}</p>
                            </div>
                            <div className="text-center p-2 bg-muted/30 rounded">
                              <p className="text-xs text-muted-foreground">Temperature</p>
                              <p className="font-medium">{visit.vitals.temp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {mockHealthHistory.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Health History Found</h3>
                <p className="text-muted-foreground mb-4">
                  Your medical history will appear here after your first visit.
                </p>
                <Link href="/patient/book-appointment">
                  <Button>Book Your First Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

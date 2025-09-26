"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, User } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { useAuth } from "@/hooks/useAuth" // Assuming you have a useAuth hook

interface Prescription {
  id: string
  doctorName: string
  date: string
  symptoms: string
  prescriptionFile: string
  status: "Confirmed" | "Completed" | "Cancelled"
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth() // Assuming useAuth provides the logged-in user

  useEffect(() => {
    // In a real app, you'd fetch this data with authentication
    // For now, we'll assume the backend returns all appointments
    fetch("http://127.0.0.1:5000/appointments")
      .then((res) => res.json())
      .then((data) => {
        // Assuming the patientId is available on the user object
        const userPrescriptions = data.filter((p: any) => p.patientId === user?.id && p.prescriptionFile)
        setPrescriptions(userPrescriptions)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [user])

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
              <h1 className="text-3xl font-bold text-foreground">My Prescriptions</h1>
              <p className="text-muted-foreground">View and download your medical prescriptions</p>
            </div>
          </div>

          {isLoading && <p>Loading prescriptions...</p>}

          <div className="space-y-6">
            {!isLoading &&
              prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Prescription #{prescription.id}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription.doctorName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(prescription.date).toLocaleDateString()}
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={prescription.status === "Confirmed" ? "default" : "secondary"}>
                        {prescription.status}
                      </Badge>
                      <a href={prescription.prescriptionFile.replace("s3://", "https://s3.amazonaws.com/")} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Diagnosis</h4>
                      <p className="text-sm text-muted-foreground">{prescription.symptoms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isLoading && prescriptions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Prescriptions Found</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any prescriptions yet. Visit a doctor to get started.
                </p>
                <Link href="/patient/book-appointment">
                  <Button>Book Appointment</Button>
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

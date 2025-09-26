"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, FileText, Activity, Phone, Mail, MapPin } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

// Mock patient data
const mockPatient = {
  id: 1,
  name: "John Doe",
  age: 45,
  gender: "Male",
  phone: "(555) 123-4567",
  email: "john.doe@email.com",
  address: "123 Main St, City, State 12345",
  bloodType: "O+",
  allergies: ["Penicillin", "Shellfish"],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "(555) 987-6543",
  },
  currentSymptoms: "Experiencing chest pain and shortness of breath during physical activity",
  medicalHistory: [
    {
      date: "2023-12-15",
      condition: "Hypertension",
      treatment: "Started on Lisinopril 10mg daily",
      doctor: "Dr. Sarah Johnson",
    },
    {
      date: "2023-10-20",
      condition: "High Cholesterol",
      treatment: "Lifestyle modifications recommended",
      doctor: "Dr. Sarah Johnson",
    },
  ],
  currentMedications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2023-12-15" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2023-11-01" },
  ],
  vitals: {
    bloodPressure: "140/90",
    heartRate: "78 bpm",
    temperature: "98.6°F",
    weight: "185 lbs",
    height: "5'10\"",
    lastUpdated: "2024-01-15",
  },
}

export default function PatientDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/doctor/appointments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Details</h1>
              <p className="text-muted-foreground">Comprehensive patient information and medical history</p>
            </div>
          </div>

          {/* Patient Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{mockPatient.name}</h2>
                      <p className="text-muted-foreground">
                        {mockPatient.age} years old • {mockPatient.gender} • Blood Type: {mockPatient.bloodType}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {mockPatient.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {mockPatient.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {mockPatient.address}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/doctor/prescriptions?patient=${mockPatient.id}`}>
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Write Prescription
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{mockPatient.currentSymptoms}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{mockPatient.emergencyContact.name}</p>
                    <p className="text-sm text-muted-foreground">{mockPatient.emergencyContact.relationship}</p>
                    <p className="text-sm text-muted-foreground">{mockPatient.emergencyContact.phone}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Latest Vitals</CardTitle>
                    <CardDescription>Last updated: {mockPatient.vitals.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium">{mockPatient.vitals.bloodPressure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{mockPatient.vitals.heartRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{mockPatient.vitals.weight}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">{mockPatient.vitals.temperature}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Medical History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPatient.medicalHistory.map((entry, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{entry.condition}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{entry.treatment}</p>
                            <p className="text-xs text-muted-foreground mt-2">Treated by: {entry.doctor}</p>
                          </div>
                          <Badge variant="outline">{entry.date}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPatient.currentMedications.map((medication, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{medication.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Started: {medication.startDate}</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Vital Signs
                  </CardTitle>
                  <CardDescription>Last updated: {mockPatient.vitals.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="text-2xl font-bold text-foreground">{mockPatient.vitals.bloodPressure}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                      <p className="text-2xl font-bold text-foreground">{mockPatient.vitals.heartRate}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold text-foreground">{mockPatient.vitals.temperature}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-2xl font-bold text-foreground">{mockPatient.vitals.weight}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="text-2xl font-bold text-foreground">{mockPatient.vitals.height}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

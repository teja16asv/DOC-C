"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Heart, History, Search, User, Star, MapPin, DollarSign, Bot } from "lucide-react"
import Link from "next/link"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"

// Mock data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    rating: 4.8,
    fee: 150,
    photo: "/female-doctor.png",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Practitioner",
    hospital: "Health Plus Clinic",
    rating: 4.6,
    fee: 100,
    photo: "/male-doctor.png",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    hospital: "Skin Care Center",
    rating: 4.9,
    fee: 120,
    photo: "/female-doctor.png",
  },
]

const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "Consultation",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    date: "2024-01-20",
    time: "2:30 PM",
    type: "Follow-up",
    status: "Pending",
  },
]

export default function PatientDashboard() {
  const [symptoms, setSymptoms] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockDoctors>([])
  const [showResults, setShowResults] = useState(false)
  const [symptomDuration, setSymptomDuration] = useState("")
  const [additionalConcerns, setAdditionalConcerns] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null)
  const [finderOpen, setFinderOpen] = useState(false)
  const [doctorSearch, setDoctorSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const { user, logout } = useAuth()

  const handleSymptomSearch = () => {
    if (!analysisDone) return
    // Simulate doctor recommendation based on analysis
    const inferredSpecialties = inferSpecialtiesFromText(symptoms)
    const filtered = mockDoctors.filter((d) =>
      (selectedLocation === "all" ? true : d.hospital.toLowerCase().includes(selectedLocation.toLowerCase())) &&
      (doctorSearch.trim() ? (d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())) : true) &&
      (inferredSpecialties.length === 0 ? true : inferredSpecialties.includes(d.specialty))
    )
    setSearchResults(filtered)
    setShowResults(true)
    setFinderOpen(true)
  }

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return
    setIsAnalyzing(true)
    setAnalysisDone(false)
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 800))
    const inferred = inferSpecialtiesFromText(symptoms)
    const summary = `Based on your details${symptomDuration ? ` (duration: ${symptomDuration})` : ""}, possible relevant specialties: ${inferred.length ? inferred.join(", ") : "General Practitioner"}.` 
    setAnalysisSummary(summary)
    setIsAnalyzing(false)
    setAnalysisDone(true)
  }

  function inferSpecialtiesFromText(text: string): string[] {
    const t = text.toLowerCase()
    const map: { key: string; specialty: string }[] = [
      { key: "heart", specialty: "Cardiologist" },
      { key: "chest", specialty: "Cardiologist" },
      { key: "skin", specialty: "Dermatologist" },
      { key: "rash", specialty: "Dermatologist" },
      { key: "headache", specialty: "Neurologist" },
      { key: "brain", specialty: "Neurologist" },
      { key: "bone", specialty: "Orthopedist" },
      { key: "joint", specialty: "Orthopedist" },
      { key: "fever", specialty: "General Practitioner" },
    ]
    const set = new Set<string>()
    map.forEach(({ key, specialty }) => {
      if (t.includes(key)) set.add(specialty)
    })
    return Array.from(set)
  }

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
              <span className="text-sm text-muted-foreground">Welcome, {user?.name || user?.email}</span>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                <Link href="/patient/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Symptom Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Find Doctors by Symptoms
                </CardTitle>
                <CardDescription>Describe your symptoms to get personalized doctor recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Describe your symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="e.g., chest pain, headache, fever..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">How long have you had these symptoms?</Label>
                  <Select value={symptomDuration} onValueChange={setSymptomDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-24h">Less than 24 hours</SelectItem>
                      <SelectItem value="1-3days">1-3 days</SelectItem>
                      <SelectItem value="4-7days">4-7 days</SelectItem>
                      <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                      <SelectItem value="more-1month">More than 1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Problems or Concerns</Label>
                  <Textarea
                    id="additional"
                    placeholder="Any other health concerns, medications, or relevant information"
                    value={additionalConcerns}
                    onChange={(e) => setAdditionalConcerns(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                {analysisSummary && (
                  <div className="p-3 rounded-md bg-muted text-sm text-muted-foreground">
                    {analysisSummary}
                  </div>
                )}
                <Button type="button" variant="secondary" className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                  <Bot className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                </Button>
                <Button onClick={handleSymptomSearch} className="w-full" disabled={!analysisDone}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Recommended Doctors
                </Button>
              </CardContent>
            </Card>

            {/* Doctor Recommendations */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Doctors</CardTitle>
                  <CardDescription>Based on your symptoms, here are our recommended specialists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={doctor.photo || "/placeholder.svg"}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{doctor.hospital}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{doctor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">${doctor.fee}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Link href={`/patient/book-appointment?doctor=${doctor.id}`}>
                                <Button size="sm">Book Appointment</Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Dialog open={finderOpen} onOpenChange={setFinderOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Find Doctors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="doc-search">Search</Label>
                      <div className="mt-1">
                        <input
                          id="doc-search"
                          value={doctorSearch}
                          onChange={(e) => setDoctorSearch(e.target.value)}
                          placeholder="Search doctors or specialties..."
                          className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="city">City</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No doctors found. Adjust filters or search.</div>
                    ) : (
                      searchResults.map((doctor) => (
                        <div key={doctor.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <img src={doctor.photo || "/placeholder.svg"} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{doctor.hospital}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{doctor.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">${doctor.fee}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Link href={`/patient/book-appointment?doctor=${doctor.id}`}>
                                  <Button size="sm">Book</Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => setFinderOpen(false)}>Close</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium text-foreground">{appointment.doctor}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.date}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"} className="mt-1">
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/patient/appointments">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Appointments
                  </Button>
                </Link>
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
                <Link href="/patient/prescriptions">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    View Prescriptions
                  </Button>
                </Link>
                <Link href="/patient/health-history">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <History className="h-4 w-4 mr-2" />
                    Health History
                  </Button>
                </Link>
                <Link href="/patient/book-appointment">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Visit</span>
                  <span className="text-sm font-medium">Dec 15, 2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Appointment</span>
                  <span className="text-sm font-medium">Jan 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Prescriptions</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Your health records are secure and private</p>
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

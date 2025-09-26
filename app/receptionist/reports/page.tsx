"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Download, Calendar, Users, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const mockReportData = {
  daily: {
    appointments: 24,
    revenue: 4850,
    newPatients: 5,
    cancellations: 2,
  },
  weekly: {
    appointments: 168,
    revenue: 33950,
    newPatients: 35,
    cancellations: 14,
  },
  monthly: {
    appointments: 720,
    revenue: 145200,
    newPatients: 150,
    cancellations: 58,
  },
}

const mockDoctorStats = [
  { name: "Dr. Sarah Johnson", appointments: 45, revenue: 6750, specialty: "Cardiologist" },
  { name: "Dr. Michael Chen", appointments: 38, revenue: 3800, specialty: "General Practitioner" },
  { name: "Dr. Emily Rodriguez", appointments: 42, revenue: 5040, specialty: "Dermatologist" },
  { name: "Dr. Robert Wilson", appointments: 35, revenue: 5250, specialty: "Orthopedic" },
]

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [reportType, setReportType] = useState("overview")

  const currentData = mockReportData[reportPeriod as keyof typeof mockReportData]

  const handleDownloadReport = () => {
    alert(`Downloading ${reportType} report for ${reportPeriod} period...`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/receptionist/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">View comprehensive reports and business analytics</p>
            </div>
          </div>

          {/* Report Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure your report parameters and download options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Period</label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="doctors">Doctor Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleDownloadReport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                    <p className="text-2xl font-bold text-foreground">{currentData.appointments}</p>
                    <p className="text-xs text-secondary mt-1">+12% from last period</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">${currentData.revenue.toLocaleString()}</p>
                    <p className="text-xs text-secondary mt-1">+8% from last period</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Patients</p>
                    <p className="text-2xl font-bold text-foreground">{currentData.newPatients}</p>
                    <p className="text-xs text-accent mt-1">+15% from last period</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cancellations</p>
                    <p className="text-2xl font-bold text-foreground">{currentData.cancellations}</p>
                    <p className="text-xs text-destructive mt-1">-5% from last period</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Doctor Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Doctor Performance
                </CardTitle>
                <CardDescription>Performance metrics by doctor for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDoctorStats.map((doctor, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">${doctor.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{doctor.appointments} appointments</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(doctor.appointments / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
                <CardDescription>Revenue breakdown and payment analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Cash Payments</span>
                    <span className="font-bold text-foreground">$45,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Card Payments</span>
                    <span className="font-bold text-foreground">$67,800</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Insurance Claims</span>
                    <span className="font-bold text-foreground">$32,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="font-bold text-primary">${currentData.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Payment Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collected</span>
                      <span className="font-medium text-secondary">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-accent">12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overdue</span>
                      <span className="font-medium text-destructive">3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Reports */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Generate and download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Patient Demographics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Appointment Trends</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Revenue Analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

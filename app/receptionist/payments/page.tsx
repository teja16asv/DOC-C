"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, DollarSign, Search, Filter, Calendar, User, CreditCard, Check, X } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"

const mockPayments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    service: "Consultation",
    amount: 150,
    status: "Paid",
    method: "Credit Card",
    insuranceClaim: "Approved",
  },
  {
    id: 2,
    patient: "Sarah Wilson",
    doctor: "Dr. Michael Chen",
    date: "2024-01-15",
    service: "Follow-up",
    amount: 100,
    status: "Pending",
    method: "Insurance",
    insuranceClaim: "Processing",
  },
  {
    id: 3,
    patient: "Michael Brown",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-01-14",
    service: "Check-up",
    amount: 120,
    status: "Overdue",
    method: "Cash",
    insuranceClaim: "N/A",
  },
  {
    id: 4,
    patient: "Emily Davis",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-13",
    service: "Consultation",
    amount: 150,
    status: "Paid",
    method: "Debit Card",
    insuranceClaim: "Approved",
  },
  {
    id: 5,
    patient: "Robert Johnson",
    doctor: "Dr. Michael Chen",
    date: "2024-01-12",
    service: "Annual Physical",
    amount: 200,
    status: "Pending",
    method: "Insurance",
    insuranceClaim: "Pending",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method.toLowerCase().includes(methodFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidAmount = filteredPayments
    .filter((p) => p.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = filteredPayments
    .filter((p) => p.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const overdueAmount = filteredPayments
    .filter((p) => p.status === "Overdue")
    .reduce((sum, payment) => sum + payment.amount, 0)

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
              <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
              <p className="text-muted-foreground">Track and manage patient payments and insurance claims</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">${totalRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold text-secondary">${paidAmount}</p>
                  </div>
                  <Check className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-accent">${pendingAmount}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-destructive">${overdueAmount}</p>
                  </div>
                  <X className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Payment Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients, doctors, or services..."
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
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
              <CardDescription>Manage patient payments and insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{payment.patient}</h3>
                          <p className="text-sm text-muted-foreground">{payment.doctor}</p>
                          <p className="text-sm text-muted-foreground">{payment.service}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{payment.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{payment.method}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">${payment.amount}</p>
                          <Badge
                            variant={
                              payment.status === "Paid"
                                ? "default"
                                : payment.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {payment.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Insurance: {payment.insuranceClaim}</p>
                        </div>
                        <div className="flex gap-2">
                          {payment.status === "Pending" && (
                            <Button variant="outline" size="sm">
                              Mark Paid
                            </Button>
                          )}
                          {payment.status === "Overdue" && (
                            <Button variant="destructive" size="sm">
                              Send Reminder
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Payments Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || methodFilter !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "No payment records available."}
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

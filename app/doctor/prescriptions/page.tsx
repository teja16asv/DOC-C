"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, FileText, Check } from "lucide-react"
import jsPDF from "jspdf"
import { ChatbotWidget } from "@/components/chatbot-widget"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function PrescriptionsPage() {
  const [patientName, setPatientName] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ])
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index))
    }
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = medications.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    setMedications(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleDownloadAndUpload = async () => {
    setIsUploading(true)
    try {
      // 1. Generate PDF
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text("Prescription", 105, 20, { align: "center" })
      doc.setFontSize(12)
      doc.text(`Patient: ${patientName}`, 20, 40)
      doc.text(`Diagnosis: ${diagnosis}`, 20, 50)
      doc.text("--------------------------------------------------", 20, 60)
      let y = 70
      medications.forEach((med, i) => {
        doc.text(`Medication ${i + 1}: ${med.name} (${med.dosage})`, 20, y)
        doc.text(`  - Frequency: ${med.frequency}`, 25, (y += 7))
        doc.text(`  - Duration: ${med.duration}`, 25, (y += 7))
        doc.text(`  - Instructions: ${med.instructions}`, 25, (y += 7))
        y += 10
      })
      doc.text("--------------------------------------------------", 20, y)
      doc.text(`Notes: ${notes}`, 20, (y += 10))

      // 2. Create a File object from the PDF
      const pdfBlob = doc.output("blob")
      const filename = `prescription-${patientName.replace(/\s+/g, "-")}-${Date.now()}.pdf`
      const pdfFile = new File([pdfBlob], filename, { type: "application/pdf" })

      // 3. Upload to S3 via backend
      const formData = new FormData()
      formData.append("file", pdfFile)
      formData.append("filename", filename)

      await fetch("http://127.0.0.1:5000/upload_prescription", { method: "POST", body: formData })

      // 4. Trigger download for the user
      doc.save(filename)
    } catch (error) {
      console.error("Failed to upload or generate PDF:", error)
      alert("An error occurred while handling the prescription.")
    } finally {
      setIsUploading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-secondary">Prescription Created!</CardTitle>
            <CardDescription>The prescription has been successfully generated and saved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-2 p-4 bg-muted rounded-lg">
              <p>
                <strong>Patient:</strong> {patientName}
              </p>
              <p>
                <strong>Diagnosis:</strong> {diagnosis}
              </p>
              <p>
                <strong>Medications:</strong> {medications.length} prescribed
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleDownloadAndUpload} disabled={isUploading}>
                {isUploading ? "Processing..." : "Download & Save PDF"}
              </Button>
              <Link href="/doctor/prescriptions">
                <Button variant="outline" className="flex-1 bg-transparent">
                  New Prescription
                </Button>
              </Link>
            </div>
            <Link href="/doctor/dashboard">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/doctor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Write Prescription</h1>
              <p className="text-muted-foreground">Create a new prescription for your patient</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input
                      id="diagnosis"
                      placeholder="Enter diagnosis"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medications
                  </CardTitle>
                  <Button type="button" onClick={addMedication} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {medications.map((medication, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {medications.length > 1 && (
                        <Button type="button" onClick={() => removeMedication(index)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Medication Name</Label>
                        <Input
                          placeholder="e.g., Lisinopril"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          placeholder="e.g., 10mg"
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={medication.frequency}
                          onValueChange={(value) => updateMedication(index, "frequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once-daily">Once daily</SelectItem>
                            <SelectItem value="twice-daily">Twice daily</SelectItem>
                            <SelectItem value="three-times-daily">Three times daily</SelectItem>
                            <SelectItem value="four-times-daily">Four times daily</SelectItem>
                            <SelectItem value="as-needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          placeholder="e.g., 30 days"
                          value={medication.duration}
                          onChange={(e) => updateMedication(index, "duration", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Instructions</Label>
                      <Textarea
                        placeholder="e.g., Take with food, avoid alcohol..."
                        value={medication.instructions}
                        onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Doctor's Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional instructions or notes for the patient..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Generate Prescription
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  )
}

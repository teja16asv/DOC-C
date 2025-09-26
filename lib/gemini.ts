export interface SymptomAnalysis {
  summary: string
  specialties: string[]
  urgency: "low" | "medium" | "high"
  suggestedTests: string[]
  followUpAdvice: string
}

export interface PrescriptionData {
  patientSymptoms: string
  diagnosis: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  followUpInstructions: string
  precautions: string[]
}

export class GeminiService {
  private apiKey: string
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async analyzeSymptoms(symptoms: string, duration?: string, additionalInfo?: string): Promise<SymptomAnalysis> {
    const prompt = `You are a medical AI assistant. Analyze the following patient symptoms and provide a structured response.

Patient Symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Additional Information: ${additionalInfo || "None"}

Please provide a JSON response with the following structure:
{
  "summary": "Brief summary of the symptoms and potential causes",
  "specialties": ["Array of relevant medical specialties like Cardiologist, Dermatologist, etc."],
  "urgency": "low/medium/high based on symptom severity",
  "suggestedTests": ["Array of suggested diagnostic tests"],
  "followUpAdvice": "General advice for the patient"
}

Important: Return ONLY valid JSON, no additional text.`

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error("No response from Gemini API")
      }

      // Parse JSON response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini")
      }

      const analysis = JSON.parse(jsonMatch[0]) as SymptomAnalysis
      return analysis
    } catch (error) {
      console.error("Gemini symptom analysis error:", error)
      // Fallback response
      return {
        summary: `Based on your symptoms: ${symptoms}`,
        specialties: ["General Practitioner"],
        urgency: "medium",
        suggestedTests: ["General health checkup"],
        followUpAdvice: "Please consult with a healthcare professional for proper evaluation."
      }
    }
  }

  async generatePrescription(patientData: {
    symptoms: string
    age: number
    medicalHistory?: string
    allergies?: string
  }): Promise<PrescriptionData> {
    const prompt = `You are a medical AI assistant helping doctors generate prescriptions. Based on the patient information, provide a structured prescription.

Patient Information:
- Symptoms: ${patientData.symptoms}
- Age: ${patientData.age}
- Medical History: ${patientData.medicalHistory || "None provided"}
- Allergies: ${patientData.allergies || "None reported"}

Please provide a JSON response with the following structure:
{
  "patientSymptoms": "Summary of patient symptoms",
  "diagnosis": "Probable diagnosis based on symptoms",
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Dosage amount",
      "frequency": "How often to take",
      "duration": "How long to take",
      "instructions": "Special instructions"
    }
  ],
  "followUpInstructions": "Instructions for follow-up care",
  "precautions": ["Array of precautions and warnings"]
}

Important: Return ONLY valid JSON, no additional text.`

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error("No response from Gemini API")
      }

      // Parse JSON response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini")
      }

      const prescription = JSON.parse(jsonMatch[0]) as PrescriptionData
      return prescription
    } catch (error) {
      console.error("Gemini prescription generation error:", error)
      // Fallback response
      return {
        patientSymptoms: patientData.symptoms,
        diagnosis: "Requires further evaluation",
        medications: [{
          name: "Consult with doctor",
          dosage: "As prescribed",
          frequency: "As needed",
          duration: "Until symptoms improve",
          instructions: "Please consult with a healthcare professional for proper medication"
        }],
        followUpInstructions: "Schedule a follow-up appointment with your doctor",
        precautions: ["Consult healthcare provider before taking any medication"]
      }
    }
  }
}

// Create singleton instance
export const geminiService = new GeminiService(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAwu0TOsnowRXeLkK_-hD_YeSXHZi_F0VU")

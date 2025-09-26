import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"
import express from "express"
import cors from "cors"
import { json } from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"

// TODO: Move API Key to a secure environment variable in a .env file
const genAI = new GoogleGenerativeAI("AIzaSyAwu0TOsnowRXeLkK_-hD_YeSXHZi_F0VU");


const app = express()
app.use(cors())
app.use(json())

const PORT = process.env.PORT || 4000

// Simple JWT middleware (DEV ONLY). In prod, replace with Firebase Auth or your own.
const optionalAuth = (req: any, _res: any, next: any) => {
  const auth = req.headers.authorization
  if (auth?.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7)
      req.user = jwt.decode(token) || null
    } catch {}
  }
  next()
}

const requireAuth = (roles?: string[]) => (req: any, res: any, next: any) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" })
  const token = auth.slice(7)
  try {
    const decoded: any = jwt.decode(token)
    if (!decoded) return res.status(401).json({ error: "Invalid token" })
    if (roles && !roles.includes(decoded["custom:role"] || decoded.role)) {
      return res.status(403).json({ error: "Forbidden" })
    }
    ;(req as any).user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

// In-memory stores (replace with Firebase/Firestore or MongoDB Atlas later)
let users = [
  { id: "u1", email: "john@example.com", role: "patient" },
  { id: "u2", email: "sarah.md@example.com", role: "doctor" },
  { id: "u3", email: "maria@example.com", role: "receptionist" },
]
let profiles: Record<string, any> = {
  u1: { name: "John Doe", age: 30, location: "City", phone: "+1 555 123 4567", avatarKey: "avatars/u1.jpg" },
  u2: { name: "Dr. Sarah Johnson", hospital: "City General Hospital", specialty: "Cardiologist", location: "Downtown" },
  u3: { name: "Maria Rodriguez", hospital: "City General Hospital", location: "Downtown" },
}

let doctors = [
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "Cardiologist", hospital: "City General Hospital", rating: 4.8, fee: 150, location: "Center" },
  { id: "d2", name: "Dr. Michael Chen", specialty: "General Practitioner", hospital: "Health Plus Clinic", rating: 4.6, fee: 100, location: "City" },
  { id: "d3", name: "Dr. Emily Rodriguez", specialty: "Dermatologist", hospital: "Skin Care Center", rating: 4.9, fee: 120, location: "Center" },
]

let appointments: any[] = []
let availability: Record<string, any[]> = {
  d1: [{ date: "2025-09-20", time: "10:00" }],
}
let prescriptions: any[] = []

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }))

// Auth (mock)
app.post("/api/auth/login", (req, res) => {
  // TODO: Replace with Firebase Auth or your own auth service.
  const { email, role } = req.body || {}
  const user = users.find((u) => u.email === email && (!role || role === u.role))
  if (!user) return res.status(401).json({ error: "Invalid credentials (mock)" })
  const token = jwt.sign({ sub: user.id, email: user.email, "custom:role": user.role }, "dev-secret")
  res.json({ token })
})
app.get("/api/auth/me", optionalAuth, (req: any, res) => {
  res.json({ user: req.user || null })
})

// Profiles
app.get("/api/profiles/me", requireAuth(), (req: any, res) => {
  // TODO: Load from Firestore or MongoDB.
  const pid = req.user.sub
  res.json({ profile: profiles[pid] || null })
})
app.put("/api/profiles/me", requireAuth(), (req: any, res) => {
  // TODO: Persist to Firestore or MongoDB.
  const pid = req.user.sub
  profiles[pid] = { ...(profiles[pid] || {}), ...(req.body || {}) }
  res.json({ profile: profiles[pid] })
})

// Doctors
app.get("/api/doctors", (_req, res) => res.json({ doctors }))
app.get("/api/doctors/:id", (req, res) => {
  const d = doctors.find((x) => x.id === req.params.id)
  if (!d) return res.status(404).json({ error: "Not found" })
  res.json({ doctor: d })
})

// Appointments
app.get("/api/appointments", requireAuth(["patient", "doctor", "receptionist"]), (req: any, res) => {
  // TODO: Query from Firestore or MongoDB with role-based filters.
  const role = req.user["custom:role"]
  if (role === "patient") return res.json({ appointments: appointments.filter((a) => a.patientId === req.user.sub) })
  if (role === "doctor") return res.json({ appointments: appointments.filter((a) => a.doctorId === req.user.sub) })
  return res.json({ appointments })
})
app.post("/api/appointments", requireAuth(["patient", "receptionist"]), (req: any, res) => {
  // TODO: Write to Firestore or MongoDB with transactional safeguards.
  const schema = z.object({ doctorId: z.string(), date: z.string(), time: z.string(), type: z.string() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const id = `a${appointments.length + 1}`
  const appt = { id, patientId: req.user.sub, status: "Confirmed", ...parsed.data }
  appointments.push(appt)
  res.json({ appointment: appt })
})

// Availability
app.get("/api/availability/:doctorId", (_req, res) => res.json({ availability: availability[_req.params.doctorId] || [] }))

// Prescriptions
app.get("/api/prescriptions", requireAuth(["doctor", "patient"]), (req: any, res) => {
  // TODO: Query from Firestore or MongoDB
  const role = req.user["custom:role"]
  if (role === "patient") return res.json({ prescriptions: prescriptions.filter((p) => p.patientId === req.user.sub) })
  return res.json({ prescriptions: prescriptions.filter((p) => p.doctorId === req.user.sub) })
})
app.post("/api/prescriptions", requireAuth(["doctor"]), (req: any, res) => {
  // TODO: Persist to Firestore or MongoDB
  const schema = z.object({ patientId: z.string(), text: z.string(), fileKey: z.string().optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const id = `rx${prescriptions.length + 1}`
  const rx = { id, doctorId: req.user.sub, createdAt: new Date().toISOString(), ...parsed.data }
  prescriptions.push(rx)
  res.json({ prescription: rx })
})

// Uploads (pre-sign stub)
app.post("/api/upload/presign", requireAuth(), (_req, res) => {
  // TODO: Replace with Firebase Storage or S3-equivalent presign logic later.
  const url = `https://storage.mock/placeholder-key`
  res.json({ url, key: "placeholder-key" })
})

// AI: Analyze (pure mock now)
app.post("/api/ai/analyze", requireAuth(), (req, res) => {
  // TODO: Integrate Firebase Functions or Bedrock/watsonx via server later.
  const { symptoms, duration } = req.body || {}
  const summary = `Summary: ${symptoms?.slice(0, 120) || ""}${symptoms?.length > 120 ? "..." : ""}. Duration: ${duration || "unknown"}.`
  const specialties = inferSpecialties(symptoms || "")
  res.json({ summary, specialties })
})

// AI: Recommend doctors (rule-based mock)
app.get("/api/ai/recommend-doctors", (req, res) => {
  const q = (req.query.q as string) || ""
  const inferred = inferSpecialties(q)
  const list = doctors.filter((d) => (inferred.length ? inferred.includes(d.specialty) : true))
  res.json({ doctors: list })
})

// Chatbot
app.post("/api/chatbot/message", requireAuth(), async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful medical assistant chatbot. Your name is Doc C+. You can provide information and answer questions about health and medicine. You should never provide a diagnosis or medical advice. If you are asked for a diagnosis or medical advice, you should decline and advise the user to consult a medical professional." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I am Doc C+, your friendly medical assistant. How can I help you today?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message as string);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

function inferSpecialties(text: string): string[] {
  const t = text.toLowerCase()
  const rules = [
    { k: "chest|heart", s: "Cardiologist" },
    { k: "skin|rash", s: "Dermatologist" },
    { k: "head|migraine", s: "Neurologist" },
    { k: "fever|cough|cold", s: "General Practitioner" },
  ]
  const out = new Set<string>()
  rules.forEach((r) => { if (new RegExp(r.k).test(t)) out.add(r.s) })
  return Array.from(out)
}

app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`)
}) 
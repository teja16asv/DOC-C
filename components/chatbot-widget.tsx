"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([
    {
      text: "Hello! I'm DOC C+ AI Assistant. I can help you with:\n• General health questions\n• Appointment scheduling\n• Prescription information\n• Navigation through the platform\n\nHow can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])

  const getHealthcareResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Appointment related
    if (lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("schedule")) {
      return "I can help you with appointments! You can:\n• Book a new appointment in the 'Book Appointment' section\n• View your upcoming appointments on your dashboard\n• Cancel or reschedule existing appointments\n\nWould you like me to guide you to the appointment booking page?"
    }

    // Prescription related
    if (
      lowerMessage.includes("prescription") ||
      lowerMessage.includes("medication") ||
      lowerMessage.includes("medicine")
    ) {
      return "For prescription-related queries:\n• View your current prescriptions in the 'Prescriptions' section\n• Download prescription PDFs\n• Check medication instructions and dosages\n\nRemember to always consult your doctor before making any changes to your medications."
    }

    // Symptoms and health concerns
    if (
      lowerMessage.includes("symptom") ||
      lowerMessage.includes("pain") ||
      lowerMessage.includes("sick") ||
      lowerMessage.includes("hurt")
    ) {
      return "I understand you're experiencing symptoms. Here's what I recommend:\n• Use our symptom checker on your dashboard\n• Book an appointment with a recommended doctor\n• For emergencies, please call 911 or visit the nearest ER\n\nWould you like me to help you access the symptom checker?"
    }

    // Doctor related
    if (lowerMessage.includes("doctor") || lowerMessage.includes("physician") || lowerMessage.includes("specialist")) {
      return "Looking for doctor information? I can help you:\n• Find doctors by specialty\n• View doctor profiles and availability\n• Book appointments with specific doctors\n• Check doctor ratings and reviews\n\nWhat type of specialist are you looking for?"
    }

    // Payment and billing
    if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("bill") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("insurance")
    ) {
      return "For billing and payment questions:\n• View your payment history in your dashboard\n• Update payment methods\n• Check insurance coverage\n• Download invoices and receipts\n\nFor specific billing issues, please contact our billing department."
    }

    // Emergency situations
    if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent") || lowerMessage.includes("911")) {
      return "🚨 For medical emergencies:\n• Call 911 immediately\n• Go to the nearest emergency room\n• Contact your doctor directly\n\nThis chatbot is for general information only and cannot handle medical emergencies."
    }

    // General health questions
    if (lowerMessage.includes("health") || lowerMessage.includes("wellness") || lowerMessage.includes("advice")) {
      return "I can provide general health information, but remember:\n• Always consult healthcare professionals for medical advice\n• Use our platform to connect with qualified doctors\n• Keep track of your health history in your profile\n\nWhat specific health topic would you like to know about?"
    }

    // Platform navigation
    if (
      lowerMessage.includes("how") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("navigate") ||
      lowerMessage.includes("find")
    ) {
      return "Need help navigating DOC C+? I can guide you to:\n• Dashboard overview\n• Booking appointments\n• Viewing prescriptions\n• Accessing health history\n• Managing your profile\n\nWhat specific feature are you looking for?"
    }

    // Default responses
    const defaultResponses = [
      "Thank you for your question. For the best medical advice, I recommend consulting with one of our qualified doctors through the platform.",
      "I'm here to help with general information about DOC C+. For specific medical concerns, please book an appointment with a healthcare provider.",
      "That's an interesting question! While I can provide general guidance, our doctors can give you personalized medical advice.",
      "I'd be happy to help you navigate our platform. For medical questions, our healthcare professionals are the best resource.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)

    // Add user message
    const userMessage = { text: message, isUser: true, timestamp: new Date() }
    const newMessages = [...messages, userMessage]

    setTimeout(() => {
      const aiResponse = getHealthcareResponse(message)
      const aiMessage = { text: aiResponse, isUser: false, timestamp: new Date() }
      setMessages([...newMessages, aiMessage])
      setIsLoading(false)
    }, 1000)

    setMessages(newMessages)
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: "Book Appointment", action: "I want to book an appointment" },
    { label: "View Prescriptions", action: "Show me my prescriptions" },
    { label: "Symptom Checker", action: "I have symptoms to check" },
    { label: "Find Doctor", action: "Help me find a doctor" },
  ]

  const handleQuickAction = (action: string) => {
    setMessage(action)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 bg-healthcare-primary hover:bg-healthcare-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md h-[500px] sm:h-96 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-healthcare-primary text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">DOC C+ Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-2 max-w-[85%]`}>
                      {!msg.isUser && (
                        <div className="w-6 h-6 rounded-full bg-healthcare-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                          msg.isUser
                            ? "bg-healthcare-primary text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.isUser && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-6 h-6 rounded-full bg-healthcare-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                        className="text-xs h-8 text-healthcare-primary border-healthcare-primary hover:bg-healthcare-primary hover:text-white"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={isLoading || !message.trim()}
                  className="bg-healthcare-primary hover:bg-healthcare-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

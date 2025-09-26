import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth"; // Adjust the import path as needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doc C+",
  description: "Your AI-powered healthcare assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider, SignedOut, SignIn, SignedIn } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
import AuthLanding from "@/components/ui/AuthLanding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S3 File Manager UI",
  description: "Created by Gaurang Khator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SignedOut>
          <AuthLanding />
        </SignedOut>
        <SignedIn> 
          {children} 
          <Toaster />
        </SignedIn>
      </body>
    </html>
    </ClerkProvider>
  );
}

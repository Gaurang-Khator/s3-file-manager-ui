'use client';
import React, { useEffect } from "react";
import { SignIn, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Upload, Shield, FolderOpen } from "lucide-react";

export default function AuthLanding() {
  const clerk = useClerk();

  useEffect(() => {
    const handleUnload = () => {
      void clerk.signOut();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [clerk]);

  const features = [
    "Multi-bucket support",
    "Simple file uploads",
    "Preview & quick downloads",
    "Secure authentication via Clerk",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">
        {/* Left hero section */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-xl space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S3
                </div>
                S3-Sync
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                A simple, secure UI to manage your S3 buckets
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-800">
                Manage files faster - secure by default
              </h2>
              <p className="text-lg text-slate-600">
                Upload, preview, and organize files across buckets with an opinionated User Interface and Clerk authentication.
              </p>
            </div>

            {/* Features list */}
            {/* <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base">Multi-Bucket</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access and manage multiple S3 buckets from one interface
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base">Easy Uploads</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Drag and drop files or browse to upload to your buckets
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base">Secure Access</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Protected by Clerk authentication and AWS security
                  </CardDescription>
                </CardContent>
              </Card>
        </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => e.preventDefault()}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300"
                onClick={(e) => e.preventDefault()}
              >
                Learn more
              </Button>
            </div>

            {/* Footer tech stack */}
            <p className="text-sm text-slate-500">
              Built with Next.js · AWS · Tailwind CSS · Clerk
            </p>
          </div>
        </div>

        {/* Right sign-in section */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-white/40 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl border-slate-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to continue to your S3 dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignIn routing="hash"/>
              <p className="text-xs text-slate-500 text-center pt-4">
                By signing in you agree to the project's usage policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
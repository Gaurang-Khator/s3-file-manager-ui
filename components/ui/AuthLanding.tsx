'use client';

import React, { useEffect } from "react";
import { SignIn, useClerk } from "@clerk/nextjs";

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
    "Drag & drop uploads",
    "Preview & quick downloads",
    "Secure auth via Clerk",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="relative max-w-7xl w-full rounded-3xl overflow-hidden shadow-2xl dark:shadow-black/30 grid grid-cols-1 md:grid-cols-2">
        {/* left hero */}
        <div className="relative p-12 md:p-16 bg-gradient-to-b from-white/60 to-transparent dark:from-black/50 dark:to-transparent">
          <div className="absolute inset-0 pointer-events-none opacity-70">
            {/* decorative blobs */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#A78BFA" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#60A5FA" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d="M0 400 C150 300 250 500 420 420 C590 340 700 520 800 420 L800 600 L0 600 Z" fill="url(#g1)"/>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-500 flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                S3
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">S3-Sync</h2>
                <p className="text-sm text-muted-foreground">A simple, secure UI to manage your S3 buckets</p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Manage files faster — secure by default</h1>
            <p className="text-base text-muted-foreground max-w-xl mb-8">
              Upload, preview, and organize files across buckets with an opinionated UI and Clerk authentication.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-green-500 text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 items-center">
              <a
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground shadow hover:brightness-95 transition"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Get started
              </a>
              <a className="text-sm text-muted-foreground underline" href="#" onClick={(e) => e.preventDefault()}>
                Learn more
              </a>
            </div>

            <p className="text-xs text-muted-foreground mt-8">Built with Next.js · Tailwind · Clerk</p>
          </div>
        </div>

        {/* right sign-in card */}
        <div className="flex items-center justify-center p-8 md:p-12 bg-transparent">
          <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-border rounded-2xl shadow-lg p-6">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold">Welcome back</h3>
              <p className="text-sm text-muted-foreground">Sign in to continue to your S3 dashboard</p>
            </div>

            <div className="mb-4">
              <SignIn routing="hash" appearance={{ variables: { colorPrimary: 'var(--primary)' } }} />
            </div>

            <div className="mt-4 text-xs text-center text-muted-foreground">
              By signing in you agree to the project's usage policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
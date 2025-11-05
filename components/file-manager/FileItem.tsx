"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function FileItem({
  keyName,
  size,
  lastModified,
  onPreview,
}: {
  keyName: string;
  size: number;
  lastModified: string;
  onPreview: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-sm">
      <div className="flex items-center gap-3 min-w-0">
        <svg className="w-6 h-6 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V7l-5-4H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>

        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{keyName}</div>
          <div className="text-xs text-slate-500">
            {formatBytes(size)} • {new Date(lastModified).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a href={`/api/objects/download?key=${encodeURIComponent(keyName)}`} aria-label={`Download ${keyName}`}>
          <Button variant="ghost" size="sm" className="px-2">
            <svg className="w-4 h-4 mr-2 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 11l4 4 4-4" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
            </svg>
            <span className="sr-only">Download</span>
            <span className="hidden sm:inline text-sm text-sky-600">Download</span>
          </Button>
        </a>

        <Button variant="ghost" size="sm" onClick={onPreview} aria-label={`Preview ${keyName}`} className="px-2">
          <svg className="w-4 h-4 mr-2 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
          </svg>
          <span className="sr-only">Preview</span>
          <span className="hidden sm:inline text-sm text-slate-700">Preview</span>
        </Button>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
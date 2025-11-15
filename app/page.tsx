import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/ui/nav";
import FileManager from "@/components/file-manager/FileManager";
import { Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {/* <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">S3-Sync Dashboard</h1>
              <p className="text-slate-600 text-sm">Manage your S3 buckets and files</p>
            </div>
          </div>
          <Separator />
        </div> */}

        {/* Main File Manager Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">File Manager</CardTitle>
            <CardDescription>
              Browse, upload, and manage your S3 objects
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <FileManager apiPath="/api/objects" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
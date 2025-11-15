import Image from "next/image";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav";
import FileManager from "@/components/file-manager/FileManager";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">S3-Sync</h1>
        <FileManager apiPath="/api/objects" />
      </main>
    </div>
  );
}

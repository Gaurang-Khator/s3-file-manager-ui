"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FileItem from "./FileItem";

type ApiResponse = {
  files: { Key: string; Size: number; lastModified: string }[];
  folders: string[];
};

export default function FileManager({ apiPath }: { apiPath: string }) {
  const [data, setData] = useState<ApiResponse>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(apiPath)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json: ApiResponse) => {
        if (!mounted) return;
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [apiPath]);

  const filesToShow = data.files.filter((f) =>
    selectedFolder ? f.Key.startsWith(selectedFolder) : true
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Left: folders */}
        <aside className="w-64 border-r">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Folders</span>
              <span className="text-xs text-gray-500">{data.folders.length}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[32rem]">
              <div className="p-3 space-y-2">
                <Button
                  variant={selectedFolder === null ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(null)}
                >
                  All files
                </Button>

                {data.folders.map((f) => (
                  <Button
                    key={f}
                    variant={selectedFolder === f ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(f)}
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="truncate">{f}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </aside>

        {/* Right: files */}
        <section className="flex-1">
          <CardHeader className="p-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Files</CardTitle>
              <div className="text-xs text-gray-500">
                {loading ? "Loading..." : `${filesToShow.length} item(s)`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => {
                setSelectedFolder(null);
              }}>
                Reset
              </Button>
            </div>
          </CardHeader>

          <Separator />

          {error ? (
            <div className="p-4 text-red-600">Error: {error}</div>
          ) : loading ? (
            <div className="p-6">Loading files…</div>
          ) : filesToShow.length === 0 ? (
            <div className="p-6 text-gray-600">No files in this folder.</div>
          ) : (
            <CardContent className="p-0">
              <ScrollArea className="h-[32rem]">
                <ul className="divide-y">
                  {filesToShow.map((file) => (
                    <li key={file.Key}>
                      <FileItem
                        keyName={file.Key}
                        size={file.Size}
                        lastModified={file.lastModified}
                        onPreview={() => previewFile(file)}
                      />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          )}
        </section>
      </div>
    </Card>
  );
}

function previewFile(file: { Key: string }) {
  const url = `/api/objects/preview?key=${encodeURIComponent(file.Key)}`;
  window.open(url, "_blank");
}
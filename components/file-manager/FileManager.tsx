"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

type ApiResponse = {
  files: { Key: string; Size: number; lastModified: string }[];
  folders: string[];
};

export default function FileManager({ apiPath }: { apiPath: string }) {
  const [data, setData] = useState<ApiResponse>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderContents, setFolderContents] = useState<Record<string, ApiResponse>>({});

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

  // New function to fetch folder contents
  const fetchFolderContents = async (folder: string) => {
    try {
      const res = await fetch(`${apiPath}?prefix=${encodeURIComponent(folder)}`);
      if (!res.ok) throw new Error("Failed to fetch folder contents");
      const json: ApiResponse = await res.json();
      setFolderContents(prev => ({
        ...prev,
        [folder]: json
      }));
    } catch (err) {
      console.error("Error fetching folder contents:", err);
    }
  };

  const filesToShow = data.files.filter((f) =>
    selectedFolder ? f.Key.startsWith(selectedFolder) : true
  );

  function formatSize(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    } catch {
      return iso;
    }
  }

  function previewFile(file: { Key: string }) {
    const url = `/api/objects/preview?key=${encodeURIComponent(file.Key)}`;
    window.open(url, "_blank");
  }

  function downloadFile(file: { Key: string }) {
    const url = `/api/objects/download?key=${encodeURIComponent(file.Key)}`;
    // open in new tab to trigger download or navigate
    window.open(url, "_blank");
  }

  function downloadFolder(prefix: string | null) {
    if (!prefix) return;
    const url = `/api/objects/download?prefix=${encodeURIComponent(prefix)}`;
    window.open(url, "_blank");
  }

  function getDisplayName(key: string, prefix: string | null): string | null {
    if (!prefix) return key;
    
    // If the key exactly matches the prefix, return null
    if (key === prefix) return null;
    
    const dispName = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    
    // Return null instead of empty string or key
    if (!dispName) return null;
    
    return dispName.startsWith('/') ? dispName.slice(1) : dispName;
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex items-center gap-4 ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFolder(null)}
              className="cursor-pointer"
            >
              <Icons.folderOpen className="w-4 h-4 mr-2 " />
              All Files
            </Button>
            
            {selectedFolder && (
              <div className="flex items-center gap-2">
                <Icons.chevronRight className="w-4 h-4 text-muted-foreground " />
                <span className="text-sm text-muted-foreground">
                  {selectedFolder}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFolder(null)}
                  className="cursor-pointer"
                >
                  <Icons.reset className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>

            {selectedFolder && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFolder(selectedFolder)}
                    className="cursor-pointer"
                  >
                    <Icons.download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download folder</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Folder list */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {data.folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "secondary" : "outline"}
              className="justify-start h-auto py-2 cursor-pointer"
              onClick={() => {
                setSelectedFolder(folder);
                // Fetch contents if we haven't already
                if (!folderContents[folder]) {
                  fetchFolderContents(folder);
                }
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icons.folder className="w-4 h-4 text-amber-500" />
                  <span className="truncate">{folder}</span>
                </div>
                {folderContents[folder] && (
                  <span className="text-xs text-muted-foreground">
                    {folderContents[folder].files.length-1}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Files table */}
        <ScrollArea className="h-[calc(100vh-300px)] border rounded-md">
          {error ? (
            <div className="p-4 text-red-600">Error: {error}</div>
          ) : loading ? (
            <div className="p-4">Loading files...</div>
          ) : selectedFolder && 
              folderContents[selectedFolder]?.files.filter(file => 
                getDisplayName(file.Key, selectedFolder) !== null
              ).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <Icons.folder className="w-8 h-8 mb-2 text-muted-foreground/50" />
              <p>This folder is empty</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="w-[100px] text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedFolder && folderContents[selectedFolder]
                  ? folderContents[selectedFolder].files
                  : filesToShow
                )
                  .filter(file => getDisplayName(file.Key, selectedFolder) !== null)
                  .map((file) => (
                  <TableRow key={file.Key}>
                    <TableCell className="font-medium p-4">
                      <div className="flex items-center gap-2">
                        <Icons.file className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">
                          {getDisplayName(file.Key, selectedFolder)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatSize(file.Size)}</TableCell>
                    <TableCell>{formatDate(file.lastModified)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => previewFile(file)}
                              className="cursor-pointer"
                            >
                              <Icons.eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              className="cursor-pointer"
                            >
                              <Icons.download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/* Small inline SVG icon components so no extra deps are required */
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}
function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" fill="currentColor" />
    </svg>
  );
}
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
function PreviewIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ResetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 6" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
function AllFilesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
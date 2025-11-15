"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { 
  Upload, 
  FolderOpen, 
  RefreshCw, 
  Home,
  ChevronRight,
  MoreVertical,
  File,
  Folder,
  Download,
  Eye
} from "lucide-react";
import { toast } from "sonner";

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
      toast.error("Failed to load folder", {
        description: "There was an error loading the folder contents.",
      });
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

  function downloadFolder(prefix: string | null) {
    if (!prefix) return;
    const url = `/api/download?prefix=${encodeURIComponent(prefix)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started", {
      description: `Downloading ${prefix}.zip`,
    });
  }

  function getDisplayName(key: string, prefix: string | null): string | null {
    if (!prefix) return key;
    if (key === prefix) return null;
    const dispName = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    if (!dispName) return null;
    return dispName.startsWith('/') ? dispName.slice(1) : dispName;
  }

  async function handleUpload(folder: string | null, file: File) {
    try {
      const keyPath = folder ? `${folder}${file.name}` : file.name;
      const res = await fetch(`/api/upload?key=${encodeURIComponent(keyPath)}`);
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { url } = await res.json();

      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file');

      toast.success("File uploaded successfully", {
        style: {
          backgroundColor: '#22c55e', 
          color: 'white',
          border: '1px solid #16a34a', 
        },
        description: `${file.name} has been uploaded to ${folder}`,
        duration: 3000,
      });

      if (folder) {
        await fetchFolderContents(folder);
      } else {
        // Refresh root directory
        const res = await fetch(apiPath);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Upload failed", {
        style: {
          backgroundColor: '#dc2626', 
          color: 'white',
          border: '1px solid #b91c1c', 
        },
        description: "There was an error uploading your file. Please try again.",
        duration: 3000,
      });
    }
  }

  const UploadButton = ({ folder }: { folder: string | null }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <>
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleUpload(folder, file);
              if (inputRef.current) inputRef.current.value = '';
            }
          }}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={() => inputRef.current?.click()}
                className="gap-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {folder ? `Upload to ${folder}` : 'Upload to root directory'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await fetch(`/api/download?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      
      const link = document.createElement('a');
      link.href = data.url;
      link.download = key.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Downloaded Successfully", {
        style: {
          backgroundColor: '#22c55e', 
          color: 'white',
          border: '1px solid #16a34a', 
        },
        description: `Downloaded ${key.split('/').pop()}`,
        duration: 1500,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Download failed", {
        style: {
          backgroundColor: '#dc2626', 
          color: 'white',
          border: '1px solid #b91c1c', 
        },
        description: "There was an error downloading the file.",
        duration: 3000,
      });
    }
  };

  const handlePreview = async (key: string) => {
    try {
      const response = await fetch(`/api/preview?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      window.open(data.url, "_blank");
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error("Preview failed", {
        style: {
          backgroundColor: '#dc2626', 
          color: 'white',
          border: '1px solid #b91c1c', 
        },
        description: "There was an error previewing the file.",
        duration: 3000,
      });
    }
  };

  const totalFiles = selectedFolder && folderContents[selectedFolder]
    ? folderContents[selectedFolder].files.filter(file => 
        getDisplayName(file.Key, selectedFolder) !== null
      ).length
    : filesToShow.length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-2 pl-8 pr-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFolder(null)}
                      className="gap-2 h-4 cursor-pointer"
                    >
                      <Home className="h-4 w-4" />
                      <span className="hidden sm:inline">Root</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Go to root directory</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {selectedFolder && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="gap-2">
                    <FolderOpen className="h-3 w-3" />
                    {selectedFolder}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <File className="h-3 w-3" />
                {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                {selectedFolder || "All Folders"}
              </CardTitle>
              <CardDescription className="mt-1">
                {selectedFolder 
                  ? `Browse files in ${selectedFolder}` 
                  : "Select a folder to view its contents"}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <UploadButton folder={selectedFolder} />
              
              {selectedFolder && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFolder(selectedFolder)}
                        className="gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download All</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download entire folder as ZIP</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFolder(null);
                        setFolderContents({});
                      }}
                      className="cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset view</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {/* Folder Grid */}
          {!selectedFolder && data.folders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {data.folders.map((folder) => (
                  <Button
                    key={folder}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedFolder(folder);
                      if (!folderContents[folder]) {
                        fetchFolderContents(folder);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Folder className="h-6 w-6 text-amber-500" />
                      {folderContents[folder] && (
                        <Badge variant="secondary" className="text-xs">
                          {folderContents[folder].files.length - 1}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate w-full text-left">
                      {folder}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedFolder && <Separator className="mb-6" />}

          {/* Files Table */}
          <div>
            {selectedFolder && (
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Files</h3>
            )}
            
            <ScrollArea className="h-[calc(100vh-450px)] border rounded-lg">
              {error ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-destructive">
                  <p className="font-medium">Error loading files</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center h-[200px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Loading files...</p>
                </div>
              ) : selectedFolder && 
                  folderContents[selectedFolder]?.files.filter(file => 
                    getDisplayName(file.Key, selectedFolder) !== null
                  ).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Folder className="h-12 w-12 mb-3 text-muted-foreground/30" />
                  <p className="font-medium">This folder is empty</p>
                  <p className="text-sm">Upload files to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="pl-6 font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Size</TableHead>
                      <TableHead className="font-semibold">Modified</TableHead>
                      <TableHead className="w-[100px] text-right pr-12 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(selectedFolder && folderContents[selectedFolder]
                      ? folderContents[selectedFolder].files
                      : filesToShow
                    )
                      .filter(file => getDisplayName(file.Key, selectedFolder) !== null)
                      .map((file) => (
                      <TableRow key={file.Key} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium p-4">
                          <div className="flex items-center gap-3">
                            <File className="h-4 w-4 text-blue-600" />
                            <span className="truncate">
                              {getDisplayName(file.Key, selectedFolder)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {formatSize(file.Size)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(file.lastModified)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1 pr-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(file.Key)}
                                    className="h-8 w-8 p-0 cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Preview file</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownload(file.Key)}
                                    className="h-8 w-8 p-0 cursor-pointer"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download file</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePreview(file.Key)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(file.Key)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { PDFViewer } from "@/src/components/shared/PDFViewer";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: "book" | "course" | "project";
}

function getTitle(item: any, type: string) {
  if (type === "book") return item.title;
  if (type === "course") return `${item.courseCode} — ${item.courseTitle}`;
  return item.title;
}

export function PreviewDialog({
  open,
  onOpenChange,
  item,
  type,
}: PreviewDialogProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    if (open && !signedUrl) {
      fetchSignedUrl();
    }
  }, [open]);

  async function fetchSignedUrl() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: item.fileUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSignedUrl(data.data.signedUrl);
      }
    } catch {
      console.error("Failed to fetch signed URL");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Preview: {getTitle(item, type)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : signedUrl ? (
              <div className="space-y-4">
                {/* File Info */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">File URL</span>
                    <span className="text-slate-900 font-mono text-xs truncate max-w-xs">
                      {item.fileUrl}
                    </span>
                  </div>
                </div>

                {/* Open PDF Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    onOpenChange(false);
                    setShowPDF(true);
                  }}
                >
                  Open PDF Viewer
                </Button>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">
                Failed to load preview
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen PDF Viewer */}
      {showPDF && signedUrl && (
        <PDFViewer
          url={signedUrl}
          title={getTitle(item, type)}
          onClose={() => setShowPDF(false)}
        />
      )}
    </>
  );
}
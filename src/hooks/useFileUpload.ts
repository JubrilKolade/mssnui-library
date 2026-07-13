import { useState, useCallback } from "react";
import { useToast } from "@/src/hooks/use-toast";

interface UploadProgress {
  percentage: number;
  status: "idle" | "uploading" | "success" | "error";
}

interface UploadResult {
  key: string;
  publicUrl: string;
}

export function useFileUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    status: "idle",
  });
  const { toast } = useToast();

  const uploadFile = useCallback(
    async (
      file: File,
      fileType: "books" | "courses" | "projects" | "covers"
    ): Promise<UploadResult | null> => {
      try {
        setProgress({ percentage: 0, status: "uploading" });

        // Step 1: Get presigned URL
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileType,
            fileSize: file.size,
          }),
        });

        const presignData = await presignRes.json();

        if (!presignData.success) {
          throw new Error(presignData.error);
        }

        const { uploadUrl, key, publicUrl } = presignData.data;

        // Step 2: Upload directly to R2 with progress tracking
        await uploadWithProgress(file, uploadUrl, (percentage) => {
          setProgress({ percentage, status: "uploading" });
        });

        setProgress({ percentage: 100, status: "success" });

        return { key, publicUrl };
      } catch (error: any) {
        setProgress({ percentage: 0, status: "error" });
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error.message || "Please try again",
        });
        return null;
      }
    },
    [toast]
  );

  function reset() {
    setProgress({ percentage: 0, status: "idle" });
  }

  return { uploadFile, progress, reset };
}

function uploadWithProgress(
  file: File,
  url: string,
  onProgress: (percentage: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        onProgress(percentage);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
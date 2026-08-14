"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn, formatFileSize } from "@/src/lib/utils";
import { Progress } from "@/src/components/ui/progress";
import { Button } from "@/src/components/ui/button";

interface FileUploadInputProps {
  accept: Record<string, string[]>;
  maxSize: number;
  label: string;
  description: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  progress: {
    percentage: number;
    status: "idle" | "uploading" | "success" | "error";
  };
  selectedFile: File | null;
}

export function FileUploadInput({
  accept,
  maxSize,
  label,
  description,
  onFileSelect,
  onClear,
  progress,
  selectedFile,
}: FileUploadInputProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File too large. Max size is ${formatFileSize(maxSize)}`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type");
        } else {
          setError("File not accepted");
        }
        return;
      }

      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="space-y-3">
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border",
            progress.status === "success"
              ? "border-emerald-200 bg-emerald-50"
              : progress.status === "error"
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-slate-50"
          )}
        >
          {/* File Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              progress.status === "success"
                ? "bg-emerald-100"
                : progress.status === "error"
                ? "bg-red-100"
                : "bg-white border border-slate-200"
            )}
          >
            {progress.status === "uploading" ? (
              <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
            ) : progress.status === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : progress.status === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <File className="w-5 h-5 text-slate-500" />
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          {/* Clear Button */}
          {progress.status !== "uploading" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 flex-shrink-0"
              onClick={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {progress.status === "uploading" && (
          <div className="space-y-1">
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-xs text-slate-500 text-right">
              {progress.percentage}%
            </p>
          </div>
        )}

        {progress.status === "success" && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Uploaded successfully
          </p>
        )}

        {progress.status === "error" && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Upload failed. Please try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-200 hover:border-emerald-300 hover:bg-amber-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "w-8 h-8 mx-auto mb-2",
            isDragActive ? "text-emerald-600" : "text-slate-400"
          )}
        />
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
        <p className="text-xs text-slate-400">
          Max size: {formatFileSize(maxSize)}
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
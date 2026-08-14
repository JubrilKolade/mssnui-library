"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageInput, setPageInput] = useState("1");

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function goToPrevPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setPageInput(String(Math.max(1, currentPage - 1)));
  }

  function goToNextPage() {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
    setPageInput(String(Math.min(numPages, currentPage + 1)));
  }

  function handlePageInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPageInput(e.target.value);
  }

  function handlePageSubmit(e: React.FormEvent) {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  }

  function zoomIn() {
    setScale((prev) => Math.min(3, prev + 0.25));
  }

  function zoomOut() {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  }

  function rotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center gap-3 shrink-0">
        {/* Title */}
        <p className="text-sm font-medium truncate flex-1">{title}</p>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-slate-700"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <form
            onSubmit={handlePageSubmit}
            className="flex items-center gap-1"
          >
            <Input
              type="number"
              value={pageInput}
              onChange={handlePageInput}
              className="w-14 h-7 text-center text-xs bg-slate-700 border-slate-600 text-white"
              min={1}
              max={numPages}
            />
            <span className="text-xs text-slate-400">
              / {numPages}
            </span>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-slate-700"
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-slate-700"
            onClick={zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-slate-400 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-slate-700"
            onClick={zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Rotate */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-white hover:bg-slate-700"
          onClick={rotate}
        >
          <RotateCw className="w-4 h-4" />
        </Button>

        {/* Close */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-white hover:bg-red-600"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        {isLoading && (
          <div className="flex items-center gap-2 text-white mt-20">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading PDF...</span>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading=""
          className="shadow-2xl"
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            rotate={rotation}
            loading={
              <div className="w-150 h-200 bg-white animate-pulse" />
            }
          />
        </Document>
      </div>
    </div>
  );
}
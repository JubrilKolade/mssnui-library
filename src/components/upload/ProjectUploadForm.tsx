"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info, ChevronDown } from "lucide-react";
import { projectUploadSchema, type ProjectUploadInput } from "@/src/lib/validations";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { FileUploadInput } from "./FileUploadInput";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useToast } from "@/src/hooks/use-toast";

interface ProjectUploadFormProps {
  departments: any[];
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

const selectClass =
  "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectUploadForm({ departments }: ProjectUploadFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string>("");

  const { toast } = useToast();
  const { uploadFile, progress, reset } = useFileUpload();

  const form = useForm<ProjectUploadInput>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      title: "",
      authorName: "",
      supervisor: "",
      abstract: "",
      fileKey: "",
      fileSize: 0,
    },
  });

  async function handlePdfSelect(file: File) {
    setPdfFile(file);
    form.setValue("fileSize", file.size);

    const result = await uploadFile(file, "projects");
    if (result) {
      setUploadedKey(result.key);
      form.setValue("fileKey", result.key);
    }
  }

  function clearPdf() {
    setPdfFile(null);
    reset();
    setUploadedKey("");
    form.setValue("fileKey", "");
    form.setValue("fileSize", 0);
  }

  async function onSubmit(data: ProjectUploadInput) {
    if (!uploadedKey || progress.status !== "success") {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a PDF file",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/upload/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fileKey: uploadedKey }),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error,
        });
        return;
      }

      toast({
        title: "Project submitted! 🎓",
        description: "Pending admin approval",
      });

      form.reset();
      clearPdf();
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="w-4 h-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          All uploads are reviewed by admins before becoming visible.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* PDF Upload */}
          <div className="space-y-2">
            <FormLabel>
              PDF File <span className="text-red-500">*</span>
            </FormLabel>
            <FileUploadInput
              accept={PDF_ACCEPT}
              maxSize={50 * 1024 * 1024}
              label="Drop PDF here or click to browse"
              description="Only PDF files accepted"
              onFileSelect={handlePdfSelect}
              onClear={clearPdf}
              progress={progress}
              selectedFile={pdfFile}
            />
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full title of the project"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author & Supervisor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Author Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Student full name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Supervisor{" "}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dr. Supervisor Name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Department & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Department <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isSubmitting}
                        className={selectClass}
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Year <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        disabled={isSubmitting}
                        className={selectClass}
                      >
                        <option value="">Select year</option>
                        {years.map((year) => (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Abstract */}
          <FormField
            control={form.control}
            name="abstract"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Abstract{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief summary of the project..."
                    rows={4}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            disabled={isSubmitting || progress.status === "uploading"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
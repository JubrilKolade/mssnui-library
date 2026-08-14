"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import { courseUploadSchema, type CourseUploadInput } from "@/src/lib/validations";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { FileUploadInput } from "./FileUploadInput";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useToast } from "@/src/hooks/use-toast";

interface CourseUploadFormProps {
  departments: any[];
}

const levels = [100, 200, 300, 400, 500, 600];

const courseTypes = [
  { value: "note", label: "Lecture Note" },
  { value: "past_question", label: "Past Question" },
  { value: "handout", label: "Handout" },
  { value: "assignment", label: "Assignment" },
];

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

export function CourseUploadForm({ departments }: CourseUploadFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string>("");

  const router = useRouter();
  const { toast } = useToast();
  const { uploadFile, progress, reset } = useFileUpload();

  const form = useForm<CourseUploadInput>({
    resolver: zodResolver(courseUploadSchema),
    defaultValues: {
      courseCode: "",
      courseTitle: "",
      fileKey: "",
      fileSize: 0,
    },
  });

  async function handlePdfSelect(file: File) {
    setPdfFile(file);
    form.setValue("fileSize", file.size);

    const result = await uploadFile(file, "courses");
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

  async function onSubmit(data: CourseUploadInput) {
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

      const res = await fetch("/api/upload/course", {
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
        title: "Course material submitted! 🎓",
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

          {/* Course Code & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g CSC 301"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g Data Structures"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Department */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} — {dept.academicUnit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level, Semester, Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v as string))}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={String(level)}>
                          {level} Level
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Semester <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="first">First Semester</SelectItem>
                      <SelectItem value="second">Second Semester</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
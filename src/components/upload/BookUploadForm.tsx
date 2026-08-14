"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import { bookUploadSchema, type BookUploadInput } from "@/src/lib/validations";
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
  FormDescription,
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

interface BookUploadFormProps {
  categories: { id: string; name: string }[];
  departments: any[];
}

const languages = [
  "English",
  "Arabic",
  "French",
  "Yoruba",
  "Hausa",
  "Igbo",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const PDF_ACCEPT = { "application/pdf": [".pdf"] };
const IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function BookUploadForm({
  categories,
  departments,
}: BookUploadFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedKeys, setUploadedKeys] = useState<{
    fileKey?: string;
    coverKey?: string;
  }>({});

  const router = useRouter();
  const { toast } = useToast();

  const {
    uploadFile: uploadPdf,
    progress: pdfProgress,
    reset: resetPdf,
  } = useFileUpload();

  const {
    uploadFile: uploadCover,
    progress: coverProgress,
    reset: resetCover,
  } = useFileUpload();

  const form = useForm<BookUploadInput>({
    resolver: zodResolver(bookUploadSchema) as any,
    defaultValues: {
      title: "",
      author: "",
      description: "",
      language: "English",
      fileKey: "",
      fileSize: 0,
    },
  });

  async function handlePdfSelect(file: File) {
    setPdfFile(file);
    form.setValue("fileSize", file.size);

    const result = await uploadPdf(file, "books");
    if (result) {
      setUploadedKeys((prev) => ({ ...prev, fileKey: result.key }));
      form.setValue("fileKey", result.key);
    }
  }

  async function handleCoverSelect(file: File) {
    setCoverFile(file);

    const result = await uploadCover(file, "covers");
    if (result) {
      setUploadedKeys((prev) => ({ ...prev, coverKey: result.key }));
      form.setValue("coverKey", result.key);
    }
  }

  function clearPdf() {
    setPdfFile(null);
    resetPdf();
    setUploadedKeys((prev) => ({ ...prev, fileKey: undefined }));
    form.setValue("fileKey", "");
    form.setValue("fileSize", 0);
  }

  function clearCover() {
    setCoverFile(null);
    resetCover();
    setUploadedKeys((prev) => ({ ...prev, coverKey: undefined }));
    form.setValue("coverKey", "");
  }

  async function onSubmit(data: BookUploadInput) {
    if (!uploadedKeys.fileKey) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a PDF file",
      });
      return;
    }

    if (pdfProgress.status !== "success") {
      toast({
        variant: "destructive",
        title: "File still uploading",
        description: "Please wait for upload to complete",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/upload/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fileKey: uploadedKeys.fileKey,
          coverKey: uploadedKeys.coverKey,
        }),
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
        title: "Book submitted for review! 📚",
        description: "An admin will review and approve your submission",
      });

      router.push("/upload?tab=my-uploads");
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Alert className="border-border bg-accent">
        <Info className="w-4 h-4 text-accent-foreground" />
        <AlertDescription className="text-accent-foreground text-sm">
          All uploads are reviewed by admins before becoming visible to
          other users.
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
              progress={pdfProgress}
              selectedFile={pdfFile}
            />
            {form.formState.errors.fileKey && (
              <p className="text-xs text-red-600">
                {form.formState.errors.fileKey.message}
              </p>
            )}
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <FormLabel>
              Cover Image{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </FormLabel>
            <FileUploadInput
              accept={IMAGE_ACCEPT}
              maxSize={5 * 1024 * 1024}
              label="Drop cover image here or click to browse"
              description="JPG, PNG, WEBP accepted"
              onFileSelect={handleCoverSelect}
              onClear={clearCover}
              progress={coverProgress}
              selectedFile={coverFile}
            />
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Book Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g Sahih Al-Bukhari"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Author <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g Imam Al-Bukhari"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the book..."
                    rows={3}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
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
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
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
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Language, Year, Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
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
              name="publishedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published Year</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v as string))}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
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
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Pages</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g 200"
                      disabled={isSubmitting}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              pdfProgress.status === "uploading" ||
              coverProgress.status === "uploading"
            }
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
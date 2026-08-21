"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";

const schema = z.object({
  reason: z
    .string()
    .min(10, "Please provide a reason (at least 10 characters)")
    .max(500, "Reason too long"),
});

type FormData = z.infer<typeof schema>;

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: "book" | "course" | "project";
  adminId: string;
  onProcessed: (id: string) => void;
}

const quickReasons = [
  "Duplicate content already exists in the library",
  "Poor quality or unreadable file",
  "Content violates library guidelines",
  "Incorrect metadata or information provided",
  "File is corrupted or incomplete",
  "Content is not relevant to the library's scope",
];

export function RejectDialog({
  open,
  onOpenChange,
  item,
  type,
  adminId,
  onProcessed,
}: RejectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);

      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          type,
          action: "reject",
          adminId,
          reason: data.reason,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Rejection failed",
          description: result.error,
        });
        return;
      }

      toast({
        title: "Content rejected",
        description: "The uploader has been notified",
      });

      form.reset();
      onOpenChange(false);
      onProcessed(item.id);
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function applyQuickReason(reason: string) {
    form.setValue("reason", reason);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Reject Content
          </DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting this submission. The uploader
            will be notified.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Quick Reasons */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Quick Reasons
              </p>
              <div className="flex flex-wrap gap-2">
                {quickReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => applyQuickReason(reason)}
                    className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rejection Reason{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this content is being rejected..."
                      rows={4}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Content"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
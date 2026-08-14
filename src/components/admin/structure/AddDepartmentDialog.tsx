"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useToast } from "@/src/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  isDLC: z.boolean().default(false),
  isPostgraduate: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface AddDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicUnitId: string;
  academicUnitName: string;
  onSuccess: () => void;
}

export function AddDepartmentDialog({
  open,
  onOpenChange,
  academicUnitId,
  academicUnitName,
  onSuccess,
}: AddDepartmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      isDLC: false,
      isPostgraduate: false,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/structure/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, academicUnitId }),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Failed to add department",
          description: result.error,
        });
        return;
      }

      toast({
        title: "Department added",
        description: `${data.name} added to ${academicUnitName}`,
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Adding to{" "}
            <span className="font-semibold text-slate-900">
              {academicUnitName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g Computer Science"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flags */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isDLC"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="font-normal cursor-pointer">
                        Distance Learning Centre (DLC)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPostgraduate"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="font-normal cursor-pointer">
                        Postgraduate Programme
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
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
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Department"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
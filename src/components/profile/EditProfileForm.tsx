"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronDown } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/hooks/use-toast";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  matricNumber: z.string().optional(),
  departmentId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditProfileFormProps {
  user: any;
  onUpdate: (user: any) => void;
}

const selectClass =
  "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export function EditProfileForm({
  user,
  onUpdate,
}: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [academicUnits, setAcademicUnits] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>(
    user.department?.academicUnitId || ""
  );
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      matricNumber: user.matricNumber || "",
      departmentId: user.departmentId || "",
    },
  });

  // Fetch academic units
  useEffect(() => {
    fetch("/api/structure/units")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAcademicUnits(data.data);
      });
  }, []);

  // Fetch departments when unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    fetch(`/api/structure/departments?unitId=${selectedUnit}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDepartments(data.data);
      });
  }, [selectedUnit]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error,
        });
        return;
      }

      toast({ title: "Profile updated successfully" });
      onUpdate({ ...user, ...result.data });
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
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Edit Profile</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Matric Number */}
          <FormField
            control={form.control}
            name="matricNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Matric Number{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g 200404"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Unit */}
          <FormItem>
            <Label>
              Faculty / Institute{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  form.setValue("departmentId", "");
                }}
                disabled={isLoading}
                className={selectClass}
              >
                <option value="">None</option>
                {academicUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </FormItem>

          {/* Department */}
          {departments.length > 0 && (
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Department{" "}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isLoading}
                        className={selectClass}
                      >
                        <option value="">None</option>
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
          )}

          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useToast } from "@/src/hooks/use-toast";
import { useEffect } from "react";

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
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-serif font-bold text-foreground mb-4">
        Edit Profile
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
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
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
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
            <FormLabel>
              Faculty / Institute{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </FormLabel>
            <Select
              value={selectedUnit}
              onValueChange={(val) => {
                setSelectedUnit(val ?? "");
                form.setValue("departmentId", "");
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {academicUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
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
          )}

          <Button
            type="submit"
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
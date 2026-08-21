"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/src/lib/validations";
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
import { useToast } from "@/src/hooks/use-toast";

interface AcademicUnit {
  id: string;
  name: string;
  type: string;
  children: AcademicUnit[];
  departments: Department[];
}

interface Department {
  id: string;
  name: string;
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [academicUnits, setAcademicUnits] = useState<AcademicUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [level, setLevel] = useState<"" | "undergraduate" | "postgraduate">("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  // Faculties selectable for the chosen level:
  // - Postgraduate: faculties under the Postgraduate School (the only
  //   top-level unit of type "school")
  // - Undergraduate: every other top-level unit; parent units like the
  //   College of Medicine expand into their child faculties
  const facultyOptions = useMemo(() => {
    const pgSchool = academicUnits.find((u) => u.type === "school");
    if (level === "postgraduate") {
      return pgSchool?.children ?? [];
    }
    return academicUnits
      .filter((u) => u.type !== "school")
      .flatMap((u) => (u.children.length > 0 ? u.children : [u]))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [academicUnits, level]);

  // Changing level resets the faculty/department cascade
  useEffect(() => {
    setSelectedUnit("");
    setDepartments([]);
  }, [level]);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      matricNumber: "",
      departmentId: "",
    },
  });

  // Fetch academic units for department selection
  useEffect(() => {
    async function fetchUnits() {
      try {
        const res = await fetch("/api/structure/units");
        const data = await res.json();
        if (data.success) setAcademicUnits(data.data);
      } catch {
        console.error("Failed to fetch academic units");
      }
    }
    fetchUnits();
  }, []);

  // Fetch departments when unit is selected
  useEffect(() => {
    if (!selectedUnit) {
      setDepartments([]);
      return;
    }
    async function fetchDepts() {
      try {
        const res = await fetch(
          `/api/structure/departments?unitId=${selectedUnit}`
        );
        const data = await res.json();
        if (data.success) setDepartments(data.data);
      } catch {
        console.error("Failed to fetch departments");
      }
    }
    fetchDepts();
  }, [selectedUnit]);

  async function onSubmit(data: RegisterInput) {
    try {
      if (!level) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please select your study level",
        });
        return;
      }

      if (!selectedUnit) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please select your faculty",
        });
        return;
      }

      if (departments.length > 0 && !data.departmentId) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please select your department",
        });
        return;
      }

      setIsLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.error,
        });
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Account created",
          description: "Please sign in with your credentials",
        });
        router.push("/login");
        return;
      }

      toast({
        title: "Welcome to MSSN UI Library! 🎉",
        description: "Your account has been created successfully",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not sign in with Google",
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            or register with email
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Abdullahi Yusuf"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    {...field}
                  />
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
                  Matric number <span className="text-destructive">*</span>
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

          {/* Study Level */}
          <FormItem>
            <FormLabel>
              Level <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              value={level}
              onValueChange={(val: string | null) => setLevel((val as "undergraduate" | "postgraduate") ?? "")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Faculty */}
          <FormItem>
            <FormLabel>
              Faculty / Institute <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              value={selectedUnit}
              onValueChange={(val: string | null) => {
                setSelectedUnit(val ?? "");
                form.setValue("departmentId", "");
              }}
              disabled={isLoading || !level}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={level ? "Select your faculty" : "Select level first"}
                />
              </SelectTrigger>
              <SelectContent>
                {facultyOptions.map((unit) => (
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
                    Department <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
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
          )}

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
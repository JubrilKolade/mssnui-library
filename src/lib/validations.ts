import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    matricNumber: z.string().optional(),
    departmentId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Book upload
export const bookUploadSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title too long"),
  author: z
    .string()
    .min(2, "Author name required")
    .max(100, "Author name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  categoryId: z.string().optional(),
  departmentId: z.string().optional(),
  language: z.string().default("English"),
  publishedYear: z
    .number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  pages: z.number().min(1).optional(),
  fileKey: z.string().min(1, "File is required"),
  coverKey: z.string().optional(),
  fileSize: z.number().min(1),
});

// Course upload
export const courseUploadSchema = z.object({
  courseCode: z
    .string()
    .min(3, "Course code required")
    .max(20, "Course code too long")
    .toUpperCase(),
  courseTitle: z
    .string()
    .min(3, "Course title required")
    .max(200, "Title too long"),
  departmentId: z.string().min(1, "Department is required"),
  level: z
    .number()
    .refine(
      (v) => [100, 200, 300, 400, 500, 600].includes(v),
      "Invalid level"
    ),
  semester: z.enum(["first", "second"]),
  type: z.enum(["note", "past_question", "handout", "assignment"]),
  fileKey: z.string().min(1, "File is required"),
  coverKey: z.string().optional(),
  fileSize: z.number().min(1),
});

// Project upload
export const projectUploadSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(300, "Title too long"),
  authorName: z
    .string()
    .min(2, "Author name required")
    .max(100, "Name too long"),
  departmentId: z.string().min(1, "Department is required"),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear()),
  supervisor: z.string().max(100).optional(),
  abstract: z.string().max(2000).optional(),
  fileKey: z.string().min(1, "File is required"),
  coverKey: z.string().optional(),
  fileSize: z.number().min(1),
});

export type BookUploadInput = z.infer<typeof bookUploadSchema>;
export type CourseUploadInput = z.infer<typeof courseUploadSchema>;
export type ProjectUploadInput = z.infer<typeof projectUploadSchema>;  
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type Role = "member" | "contributor" | "admin" | "super_admin";

export type ResourceType = "book" | "course" | "project";

export type Status = "pending" | "approved" | "rejected";

export type CourseType = "note" | "past_question" | "handout" | "assignment";

export type Semester = "first" | "second";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface College {
  id: string;
  name: string;
  faculties?: Faculty[];
  createdAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  collegeId: string;
  college?: College;
  departments?: Department[];
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
  faculty?: Faculty;
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  fileUrl: string;
  fileSize: number;
  pages?: number;
  publishedYear?: number;
  language: string;
  status: Status;
  rejectionReason?: string;
  categoryId?: string;
  departmentId?: string;
  uploadedById: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  courseCode: string;
  courseTitle: string;
  level: number;
  semester: Semester;
  type: CourseType;
  fileUrl: string;
  fileSize: number;
  coverImageUrl?: string;
  departmentId: string;
  uploadedById: string;
  status: Status;
  rejectionReason?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  authorName: string;
  abstract?: string;
  fileUrl: string;
  fileSize: number;
  coverImageUrl?: string;
  year: number;
  supervisor?: string;
  departmentId: string;
  uploadedById: string;
  status: Status;
  rejectionReason?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "approval" | "rejection" | "new_upload";
  isRead: boolean;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
export type Role = "member" | "contributor" | "admin" | "super_admin";

export type ResourceType = "book" | "course" | "project";

export type Status = "pending" | "approved" | "rejected";

export type CourseType = "note" | "past_question" | "handout" | "assignment";

export type Semester = "first" | "second";

export type UnitType = "college" | "faculty" | "institute" | "centre" | "school";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
}

export interface AcademicUnit {
  id: string;
  name: string;
  type: UnitType;
  description?: string;
  parentId?: string;
  parent?: AcademicUnit;
  children?: AcademicUnit[];
  departments?: Department[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  academicUnitId: string;
  academicUnit?: AcademicUnit;
  isDLC: boolean;
  isPostgraduate: boolean;
  users?: User[];
  courses?: Course[];
  projects?: Project[];
  books?: Book[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  matricNumber?: string;
  avatar?: string;
  isActive: boolean;
  departmentId?: string;
  department?: Department;
  createdAt: Date;
  updatedAt: Date;
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
  category?: Category;
  departmentId?: string;
  department?: Department;
  uploadedById: string;
  uploadedBy?: Pick<User, "id" | "name">;
  approvedById?: string;
  approvedBy?: Pick<User, "id" | "name">;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  status: Status;
  rejectionReason?: string;
  departmentId: string;
  department?: Department;
  uploadedById: string;
  uploadedBy?: Pick<User, "id" | "name">;
  approvedById?: string;
  approvedBy?: Pick<User, "id" | "name">;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  status: Status;
  rejectionReason?: string;
  departmentId: string;
  department?: Department;
  uploadedById: string;
  uploadedBy?: Pick<User, "id" | "name">;
  approvedById?: string;
  approvedBy?: Pick<User, "id" | "name">;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  user?: User;
  resourceType: ResourceType;
  bookId?: string;
  book?: Book;
  courseId?: string;
  course?: Course;
  projectId?: string;
  project?: Project;
  createdAt: Date;
}

export interface Download {
  id: string;
  userId: string;
  user?: User;
  resourceType: ResourceType;
  bookId?: string;
  book?: Book;
  courseId?: string;
  course?: Course;
  projectId?: string;
  project?: Project;
  downloadedAt: Date;
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
import { prisma } from "@/src/lib/prisma";

export type ResourceFileType = "books" | "courses" | "projects";

export function isResourceFileType(value: string): value is ResourceFileType {
  return value === "books" || value === "courses" || value === "projects";
}

interface ResourceFile {
  fileUrl: string;
  filename: string;
  downloadsPaused: boolean;
}

// Looks up a book/course/project by id, but only if it's approved —
// same visibility rule the detail pages already enforce.
export async function getResourceFile(
  type: ResourceFileType,
  id: string
): Promise<ResourceFile | null> {
  if (type === "books") {
    const book = await prisma.book.findUnique({
      where: { id, status: "approved" },
      select: { fileUrl: true, title: true, downloadsPaused: true },
    });
    if (!book) return null;
    return {
      fileUrl: book.fileUrl,
      filename: `${book.title}.pdf`,
      downloadsPaused: book.downloadsPaused,
    };
  }

  if (type === "courses") {
    const course = await prisma.course.findUnique({
      where: { id, status: "approved" },
      select: {
        fileUrl: true,
        courseCode: true,
        courseTitle: true,
        downloadsPaused: true,
      },
    });
    if (!course) return null;
    return {
      fileUrl: course.fileUrl,
      filename: `${course.courseCode}-${course.courseTitle}.pdf`,
      downloadsPaused: course.downloadsPaused,
    };
  }

  const project = await prisma.project.findUnique({
    where: { id, status: "approved" },
    select: { fileUrl: true, title: true, downloadsPaused: true },
  });
  if (!project) return null;
  return {
    fileUrl: project.fileUrl,
    filename: `${project.title}.pdf`,
    downloadsPaused: project.downloadsPaused,
  };
}
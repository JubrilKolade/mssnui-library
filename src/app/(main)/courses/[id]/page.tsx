import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import { isGlobalDownloadPaused } from "@/src/lib/settings";
import { CourseDetail } from "@/src/components/courses/CourseDetail";
import type { Metadata } from "next";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    select: { courseCode: true, courseTitle: true },
  });

  if (!course) return { title: "Course Not Found" };

  return {
    title: `${course.courseCode} — MSSN UI Library`,
  };
}

async function getCourse(id: string, userId: string) {
  const [course, isBookmarked, globalPaused] = await Promise.all([
    prisma.course.findUnique({
      where: { id, status: "approved" },
      include: {
        department: {
          include: {
            academicUnit: {
              include: {
                parent: { select: { name: true } },
              },
            },
          },
        },
        uploadedBy: {
          select: { name: true, avatar: true },
        },
        _count: {
          select: {
            downloads: true,
            bookmarks: true,
            views: true,
          },
        },
      },
    }),
    prisma.bookmark.findFirst({
      where: { userId, courseId: id },
    }),
    isGlobalDownloadPaused(),
  ]);

  if (!course) return null;

  // Log view
  await prisma.resourceView
    .create({
      data: {
        userId,
        resourceType: "course",
        courseId: id,
      },
    })
    .catch(() => {});

  const viewUrl = `/api/files/courses/${id}`;
  const downloadUrl = `/api/files/courses/${id}/download`;

  return {
    course,
    viewUrl,
    downloadUrl,
    isBookmarked: !!isBookmarked,
    downloadsPaused: globalPaused || course.downloadsPaused,
  };
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const session = await auth();
  if (!session) return null;

  const resolvedParams = await params;
  const data = await getCourse(resolvedParams.id, session.user.id);
  if (!data) notFound();

  return (
    <CourseDetail
      course={data.course}
      viewUrl={data.viewUrl}
      downloadUrl={data.downloadUrl}
      isBookmarked={data.isBookmarked}
      downloadsPaused={data.downloadsPaused}
    />
  );
}
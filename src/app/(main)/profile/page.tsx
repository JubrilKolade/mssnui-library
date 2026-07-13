import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { ProfileView } from "@/src/components/profile/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — MSSN UI Library",
};

async function getProfileData(userId: string) {
  const [user, downloadHistory, uploadStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
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
        _count: {
          select: {
            uploadedBooks: true,
            uploadedCourses: true,
            uploadedProjects: true,
            downloads: true,
            bookmarks: true,
          },
        },
      },
    }),

    // Recent downloads
    prisma.download.findMany({
      where: { userId },
      orderBy: { downloadedAt: "desc" },
      take: 10,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            courseCode: true,
            courseTitle: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            authorName: true,
          },
        },
      },
    }),

    // Upload stats by status
    Promise.all([
      prisma.book.count({
        where: { uploadedById: userId, status: "approved" },
      }),
      prisma.book.count({
        where: { uploadedById: userId, status: "pending" },
      }),
      prisma.course.count({
        where: { uploadedById: userId, status: "approved" },
      }),
      prisma.project.count({
        where: { uploadedById: userId, status: "approved" },
      }),
    ]).then(([approvedBooks, pendingBooks, approvedCourses, approvedProjects]) => ({
      approvedBooks,
      pendingBooks,
      approvedCourses,
      approvedProjects,
    })),
  ]);

  return { user, downloadHistory, uploadStats };
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return null;

  const { user, downloadHistory, uploadStats } = await getProfileData(
    session.user.id
  );

  if (!user) return null;

  return (
    <ProfileView
      user={user}
      downloadHistory={downloadHistory}
      uploadStats={uploadStats}
    />
  );
}
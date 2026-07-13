import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import { generateDownloadUrl } from "@/src/lib/r2";
import { ProjectDetail } from "@/src/components/projects/ProjectDetail";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, authorName: true },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — MSSN UI Library`,
    description: `${project.title} by ${project.authorName}`,
  };
}

async function getProject(id: string, userId: string) {
  const [project, isBookmarked] = await Promise.all([
    prisma.project.findUnique({
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
      where: { userId, projectId: id },
    }),
  ]);

  if (!project) return null;

  // Log view
  await prisma.resourceView
    .create({
      data: {
        userId,
        resourceType: "project",
        projectId: id,
      },
    })
    .catch(() => {});

  // Generate signed URL
  const fileKey = project.fileUrl.replace(
    `${process.env.R2_PUBLIC_URL}/`,
    ""
  );
  const signedUrl = await generateDownloadUrl(fileKey, 7200);

  return {
    project,
    signedUrl,
    isBookmarked: !!isBookmarked,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const session = await auth();
  if (!session) return null;

  const resolvedParams = await params;
  const data = await getProject(resolvedParams.id, session.user.id);
  if (!data) notFound();

  return (
    <ProjectDetail
      project={data.project}
      signedUrl={data.signedUrl}
      isBookmarked={data.isBookmarked}
    />
  );
}
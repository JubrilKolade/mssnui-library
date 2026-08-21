import { prisma } from "@/src/lib/prisma";

export const DOWNLOADS_PAUSED_KEY = "downloads_paused_all";

export async function isGlobalDownloadPaused(): Promise<boolean> {
  const setting = await prisma.setting.findUnique({
    where: { key: DOWNLOADS_PAUSED_KEY },
  });
  return setting?.value === "true";
}

export async function setGlobalDownloadPaused(paused: boolean) {
  await prisma.setting.upsert({
    where: { key: DOWNLOADS_PAUSED_KEY },
    update: { value: String(paused) },
    create: { key: DOWNLOADS_PAUSED_KEY, value: String(paused) },
  });
}

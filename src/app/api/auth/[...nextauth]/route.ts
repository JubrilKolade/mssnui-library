import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/src/lib/auth";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";

const { GET, POST: originalPOST } = handlers;

async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`login:${ip}`, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  return originalPOST(req);
}

export { GET, POST };
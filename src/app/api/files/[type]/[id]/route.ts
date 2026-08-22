import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { extractKeyFromUrl, getFileStream } from "@/src/lib/r2";
import { getResourceFile, isResourceFileType } from "@/src/lib/resource-files";

interface RouteParams {
  params: Promise<{ type: string; id: string }>;
}

// Streams the file inline for the "Read Online" viewer only.
// This is intentionally NOT a redirect to a presigned R2 URL —
// a presigned URL is a bare link anyone with it can download from
// directly, forever (until it expires), bypassing every check here.
// Routing every request through our own server means:
//   - it requires a live, authenticated session on every request
//   - it's served with Content-Disposition: inline (no save prompt)
//   - it still supports Range requests, so the PDF viewer streams
//     pages progressively instead of pulling the whole file upfront
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { type, id } = await params;
  if (!isResourceFileType(type)) {
    return NextResponse.json(
      { success: false, error: "Invalid resource type" },
      { status: 400 }
    );
  }

  const resource = await getResourceFile(type, id);
  if (!resource) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }

  try {
    const key = extractKeyFromUrl(resource.fileUrl);
    const range = req.headers.get("range");
    const file = await getFileStream(key, range);

    if (!file.body) {
      return NextResponse.json(
        { success: false, error: "File unavailable" },
        { status: 502 }
      );
    }

    const headers = new Headers({
      "Content-Type": file.contentType,
      "Content-Disposition": "inline",
      "Accept-Ranges": file.acceptRanges,
      // Never cache in shared/browser caches, and never let this be
      // resurfaced later as a downloadable file from disk cache.
      "Cache-Control": "private, no-store",
    });
    if (file.contentLength !== undefined) {
      headers.set("Content-Length", String(file.contentLength));
    }
    if (file.contentRange) {
      headers.set("Content-Range", file.contentRange);
    }

    const webStream = file.body.transformToWebStream();

    return new NextResponse(webStream, {
      status: file.statusCode,
      headers,
    });
  } catch (error) {
    console.error("File stream error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load file" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { extractKeyFromUrl, getFileStream } from "@/src/lib/r2";
import { getResourceFile, isResourceFileType } from "@/src/lib/resource-files";
import { isGlobalDownloadPaused } from "@/src/lib/settings";

interface RouteParams {
  params: Promise<{ type: string; id: string }>;
}

// Actual file download, kept separate from the view route so that
// pausing downloads (globally or per-resource) can't be bypassed by
// just calling the view URL with a "download" attribute client-side —
// this route re-checks the pause flags on the server on every request.
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

  const [resource, globalPaused] = await Promise.all([
    getResourceFile(type, id),
    isGlobalDownloadPaused(),
  ]);

  if (!resource) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }

  if (globalPaused || resource.downloadsPaused) {
    return NextResponse.json(
      { success: false, error: "Downloads are currently paused" },
      { status: 403 }
    );
  }

  try {
    const key = extractKeyFromUrl(resource.fileUrl);
    const file = await getFileStream(key);

    if (!file.body) {
      return NextResponse.json(
        { success: false, error: "File unavailable" },
        { status: 502 }
      );
    }

    const headers = new Headers({
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${resource.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    });
    if (file.contentLength !== undefined) {
      headers.set("Content-Length", String(file.contentLength));
    }

    const webStream = file.body.transformToWebStream();

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download file" },
      { status: 500 }
    );
  }
}

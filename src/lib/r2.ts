import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Generate presigned URL for upload
export async function generateUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

// Generate presigned URL for download/view
export async function generateDownloadUrl(
  key: string,
  expiresIn = 3600
) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

// Stream a file's bytes directly from R2 through our own server.
// Used so the client never receives a raw, reusable link straight to
// the bucket — every byte request has to go through our auth checks.
export async function getFileStream(key: string, range?: string | null) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ...(range ? { Range: range } : {}),
  });

  const result = await r2Client.send(command);

  return {
    body: result.Body, // web ReadableStream (Node 18+/undici based SDK)
    contentType: result.ContentType ?? "application/pdf",
    contentLength: result.ContentLength,
    contentRange: result.ContentRange,
    acceptRanges: result.AcceptRanges ?? "bytes",
    statusCode: range ? 206 : 200,
  };
}

// Get public URL (if bucket is public)
export function getPublicUrl(key: string) {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

// Extract key from URL
export function extractKeyFromUrl(url: string) {
  return url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
}

// Generate unique file key
export function generateFileKey(
  type: "books" | "courses" | "projects" | "covers",
  fileName: string
) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = fileName.split(".").pop();
  return `${type}/${timestamp}-${random}.${ext}`;
}
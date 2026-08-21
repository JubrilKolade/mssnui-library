import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Resolve pdfjs-dist from react-pdf's own dependency context so the
// copied worker always matches the API version react-pdf bundles.
const reactPdfDir = require.resolve("react-pdf/package.json").replace(/package\.json$/, "");
const pdfjsPath = require.resolve("pdfjs-dist/package.json", { paths: [reactPdfDir] });
const source = pdfjsPath.replace(/package\.json$/, "build/pdf.worker.min.mjs");
const destDir = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

if (!existsSync(source)) {
  console.warn(`[copy-pdf-worker] Worker not found at ${source}, skipping`);
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, `${destDir}pdf.worker.min.mjs`);
console.log(`[copy-pdf-worker] Synced ${source.split("node_modules").pop()} to public/`);

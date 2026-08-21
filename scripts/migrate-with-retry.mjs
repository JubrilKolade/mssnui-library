import { spawnSync } from "node:child_process";

// `prisma migrate deploy` can fail transiently when the migration
// advisory lock is contended (e.g. overlapping deploys) or the database
// endpoint hiccups. Retry a few times before failing the build.
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 20_000;

const TRANSIENT = [
  "P1001",
  "P1002",
  "advisory lock",
  "Timed out",
  "timed out",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
    });

    if (result.status === 0) {
      return;
    }

    const output = String(result.stdout ?? "") + String(result.stderr ?? "");
    const isTransient = TRANSIENT.some((t) => output.includes(t));

    if (!isTransient || attempt === MAX_ATTEMPTS) {
      process.exit(result.status ?? 1);
    }

    console.warn(
      `[migrate-retry] attempt ${attempt}/${MAX_ATTEMPTS} failed with a transient error, retrying in ${RETRY_DELAY_MS / 1000}s...`
    );
    await sleep(RETRY_DELAY_MS);
  }
}

run();

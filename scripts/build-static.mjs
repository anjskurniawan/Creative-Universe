import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const frontendDirectory = join(projectRoot, "apps", "frontend");
const exportDirectory = join(frontendDirectory, "out");
const deploymentDirectory = join(projectRoot, "apps", "backend", "public");
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? (process.env.ComSpec ?? "cmd.exe") : "npm";
const npmArguments = isWindows
  ? ["/d", "/s", "/c", "npm run build"]
  : ["run", "build"];

const build = spawnSync(npmCommand, npmArguments, {
  cwd: frontendDirectory,
  env: process.env,
  stdio: "inherit",
});

if (build.error) {
  throw build.error;
}

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(join(exportDirectory, "index.html"))) {
  throw new Error(`Static export was not found at ${exportDirectory}`);
}

rmSync(deploymentDirectory, { recursive: true, force: true });
mkdirSync(deploymentDirectory, { recursive: true });
cpSync(exportDirectory, deploymentDirectory, { recursive: true });

console.log(`Static package created at: ${deploymentDirectory}`);

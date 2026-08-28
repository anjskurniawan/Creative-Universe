import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const frontendRoot = process.cwd();
const sourceRoot = path.join(frontendRoot, "src");
const allowedImports = new Map([
  ["src/app/layout.tsx", new Set(["@react-spectrum/s2/page.css", "./global.css"])],
]);
const violations = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }

  return files;
}

const sourceFiles = await walk(sourceRoot);
const scriptFiles = sourceFiles.filter((file) => /\.(?:js|jsx|ts|tsx)$/.test(file));

for (const file of scriptFiles) {
  const relative = path.relative(frontendRoot, file).replaceAll("\\", "/");
  const content = await readFile(file, "utf8");
  const cssImports = [...content.matchAll(/import\s+["']([^"']+\.css)["'];?/g)].map((match) => match[1]);
  const allowed = allowedImports.get(relative) ?? new Set();

  for (const cssImport of cssImports) {
    if (!allowed.has(cssImport)) violations.push(`${relative}: unexpected CSS import ${cssImport}`);
  }

  if (content.includes("tw-scope")) violations.push(`${relative}: obsolete tw-scope boundary`);
}

const globalCssPath = path.join(sourceRoot, "app", "global.css");
const globalCss = await readFile(globalCssPath, "utf8");

if (globalCss.includes('@import "tailwindcss";')) {
  violations.push("src/app/global.css: unscoped Tailwind Preflight import");
}
if (!globalCss.includes('@import "tailwindcss/theme.css";')) {
  violations.push("src/app/global.css: Tailwind theme import missing");
}
if (!globalCss.includes('@import "tailwindcss/utilities.css";')) {
  violations.push("src/app/global.css: Tailwind utilities import missing");
}
if (!globalCss.includes(":where(.cu-style)")) {
  violations.push("src/app/global.css: scoped .cu-style reset missing");
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`CSS boundary verification passed for ${scriptFiles.length} source modules.`);

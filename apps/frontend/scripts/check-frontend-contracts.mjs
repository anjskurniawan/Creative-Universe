import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
const src = join(root, "src");
const failures = [];

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

if (existsSync(join(src, "app", "(dashboard)"))) failures.push("Route group legacy (dashboard) masih aktif.");

for (const file of files(src).filter((path) => [".ts", ".tsx"].includes(extname(path)))) {
  const content = readFileSync(file, "utf8");
  const name = relative(root, file).replaceAll("\\", "/");
  if (!name.startsWith("src/temp/") && /(?:from|import\()\s*["'][^"']*temp\//.test(content)) {
    failures.push(`${name}: active code imports a temporary component.`);
  }
  if (name.startsWith("src/app/") && /from ["']@\/lib\/(api|routes|echo|odds|pricetag)["']/.test(content)) {
    failures.push(`${name}: masih mengimpor facade legacy.`);
  }
  if (!name.startsWith("src/core/files/") && content.includes("new XMLHttpRequest(")) {
    failures.push(`${name}: implementasi upload tidak melalui Core files.`);
  }
  if (!name.startsWith("src/core/realtime/") && /new (Echo|Pusher)\b/.test(content)) {
    failures.push(`${name}: membuat client realtime kedua.`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Frontend architecture contracts: OK");

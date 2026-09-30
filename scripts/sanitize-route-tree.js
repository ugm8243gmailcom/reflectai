import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routeTreePath = path.join(projectRoot, "src", "routeTree.gen.js");

if (fs.existsSync(routeTreePath)) {
  const source = fs.readFileSync(routeTreePath, "utf8");
  const javascript = source
    .replace(/\/\/ @ts-nocheck\r?\n/g, "")
    .replace(/\r?\nimport type \{ getRouter \} from [\s\S]*$/, "\n");

  if (javascript !== source) fs.writeFileSync(routeTreePath, javascript);
}

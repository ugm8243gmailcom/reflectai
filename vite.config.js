// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const stripGeneratedTypes = (code) =>
  code
    .replace(/\/\/ @ts-nocheck\r?\n/g, "")
    .replace(/\r?\nimport type \{ getRouter \} from [\s\S]*$/, "\n");

const stripGeneratedRouteTreeTypes = {
  name: "strip-generated-route-tree-types",
  transform: {
    order: "pre",
    handler(code, id) {
      const normalizedId = id.split("?")[0].replaceAll("\\", "/");
      if (!normalizedId.endsWith("/src/routeTree.gen.js")) return null;

      const sanitizedCode = stripGeneratedTypes(code);
      return sanitizedCode === code ? null : sanitizedCode;
    },
  },
};

export default defineConfig({
  plugins: [stripGeneratedRouteTreeTypes],
  tanstackStart: {
    router: { disableTypes: true },
    // Redirect TanStack Start's bundled server entry to src/server.js (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

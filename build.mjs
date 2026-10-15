// Builds the site into /docs (what GitHub Pages serves).
import { build } from "esbuild";
import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("docs", { recursive: true });
await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  loader: { ".jsx": "jsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "docs/app.js",
});
await copyFile("index.html", "docs/index.html");
await writeFile("docs/.nojekyll", "");
console.log("Built to docs/");

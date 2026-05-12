import path from "node:path";

export const LINTABLE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".mjs",
  ".cjs",
]);

export function collectLintableChangedFiles(...outputs) {
  return Array.from(
    new Set(
      outputs
        .flatMap((output) => output.split("\n"))
        .map((file) => file.trim())
        .filter(Boolean)
        .filter((file) => LINTABLE_EXTENSIONS.has(path.extname(file))),
    ),
  ).sort();
}

import process from "node:process";
import { analyzeReleaseRange, renderReleaseNotes, usage } from "./release-support-lib.mjs";

try {
  const args = process.argv.slice(2);
  const report = analyzeReleaseRange(args.includes("--allow-any-branch") ? args : [...args, "--allow-any-branch"]);
  if (report.help) {
    console.log(usage("release:notes"));
    process.exit(0);
  }

  console.log(renderReleaseNotes(report));
  if (report.findings.length > 0) {
    console.error("release:notes found release mapping issues:");
    for (const finding of report.findings) console.error(`- ${finding}`);
    process.exit(1);
  }
} catch (error) {
  console.error(`release:notes failed: ${error.message}`);
  process.exit(1);
}

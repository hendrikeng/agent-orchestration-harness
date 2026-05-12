import process from "node:process";
import { analyzeReleaseRange, usage } from "./release-support-lib.mjs";

try {
  const report = analyzeReleaseRange();
  if (report.help) {
    console.log(usage("release:verify"));
    process.exit(0);
  }

  if (report.warnings.length > 0) {
    console.warn("release:verify warnings:");
    for (const warning of report.warnings) console.warn(`- ${warning}`);
  }

  if (report.findings.length > 0) {
    console.error("release:verify failed:");
    for (const finding of report.findings) console.error(`- ${finding}`);
    process.exit(1);
  }

  console.log(`release:verify passed for ${report.base}..${report.head}.`);
  console.log(`Included completed slices: ${report.plans.map((plan) => plan.planId).join(", ") || "none"}`);
} catch (error) {
  console.error(`release:verify failed: ${error.message}`);
  process.exit(1);
}

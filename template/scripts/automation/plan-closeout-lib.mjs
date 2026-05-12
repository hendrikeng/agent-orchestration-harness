import path from "node:path";

export const ACTIVE_PLAN_DIR = "docs/exec-plans/active/";
export const COMPLETED_PLAN_DIR = "docs/exec-plans/completed/";
export const EVIDENCE_INDEX_DIR = "docs/exec-plans/evidence-index/";
export const STANDARD_CHANGE_BRANCH_PREFIXES = ["fix/"];
export const HIGH_RISK_STANDARD_CHANGE_PREFIXES = [
  ".github/",
  "docs/deploy/",
  "docs/env/",
  "docs/governance/",
  "docs/ops/releases/",
  "src/auth/",
  "src/security/",
  "src/payments/",
  "src/db/",
  "src/database/",
  "src/migrations/",
  "lib/auth/",
  "lib/security/",
  "lib/payments/",
  "lib/db/",
  "lib/database/",
  "migrations/",
  "scripts/automation/",
  "scripts/docs/",
];

export const HIGH_RISK_STANDARD_CHANGE_FILES = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "README.md",
  "docs/PLANS.md",
  "docs/SECURITY.md",
  "docs/product-specs/CURRENT-STATE.md",
];

const PLAN_SURFACE_DIRS = [
  "docs/future/",
  ACTIVE_PLAN_DIR,
  COMPLETED_PLAN_DIR,
  EVIDENCE_INDEX_DIR,
];

function isMarkdownPlanDoc(filePath) {
  return filePath.endsWith(".md") && path.basename(filePath) !== "README.md";
}

export function isActivePlanPath(filePath) {
  return filePath.startsWith(ACTIVE_PLAN_DIR) && isMarkdownPlanDoc(filePath);
}

export function isCompletedPlanPath(filePath) {
  return filePath.startsWith(COMPLETED_PLAN_DIR) && isMarkdownPlanDoc(filePath);
}

export function isEvidenceIndexPath(filePath) {
  return filePath.startsWith(EVIDENCE_INDEX_DIR) && isMarkdownPlanDoc(filePath);
}

export function isPlanSurfacePath(filePath) {
  return PLAN_SURFACE_DIRS.some((prefix) => filePath.startsWith(prefix));
}

export function isStandardChangeBranch(branchName) {
  return STANDARD_CHANGE_BRANCH_PREFIXES.some((prefix) =>
    String(branchName ?? "").startsWith(prefix),
  );
}

export function isHighRiskStandardChangePath(filePath) {
  return HIGH_RISK_STANDARD_CHANGE_FILES.includes(filePath)
    || HIGH_RISK_STANDARD_CHANGE_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

export function summarizePlanCloseoutDiff(changedFiles, { branchName = "" } = {}) {
  const normalizedFiles = changedFiles
    .map((filePath) => filePath.trim())
    .filter(Boolean);
  const implementationFiles = normalizedFiles.filter(
    (filePath) => !isPlanSurfacePath(filePath),
  );
  const standardChangeBranch = isStandardChangeBranch(branchName);
  const highRiskStandardChangeFiles = standardChangeBranch
    ? implementationFiles.filter(isHighRiskStandardChangePath)
    : [];

  return {
    touchesImplementation: implementationFiles.length > 0,
    requiresPlanCloseout: implementationFiles.length > 0 && (!standardChangeBranch || highRiskStandardChangeFiles.length > 0),
    standardChangeBranch,
    highRiskStandardChangeFiles,
    implementationFiles,
    activePlanFiles: normalizedFiles.filter(isActivePlanPath),
    completedPlanFiles: normalizedFiles.filter(isCompletedPlanPath),
    evidenceIndexFiles: normalizedFiles.filter(isEvidenceIndexPath),
  };
}

export function assertMergeReadyPlanCloseout(changedFiles, options = {}) {
  const summary = summarizePlanCloseoutDiff(changedFiles, options);

  if (!summary.touchesImplementation) {
    return summary;
  }

  if (summary.activePlanFiles.length > 0) {
    throw new Error(
      `merge-ready changes cannot leave plan docs in active/: ${summary.activePlanFiles.join(", ")}`,
    );
  }

  if (!summary.requiresPlanCloseout) {
    return summary;
  }

  if (summary.completedPlanFiles.length === 0) {
    if (summary.highRiskStandardChangeFiles.length > 0) {
      throw new Error(
        `fix/* standard changes touching high-risk workflow, security, identity, payment, database, or governance paths require completed plan closeout: ${summary.highRiskStandardChangeFiles.join(", ")}`,
      );
    }
    throw new Error(
      "merge-ready non-trivial implementation changes must include a completed execution plan under docs/exec-plans/completed/",
    );
  }

  if (summary.evidenceIndexFiles.length === 0) {
    throw new Error(
      "merge-ready implementation changes must include a Done-Evidence index file under docs/exec-plans/evidence-index/",
    );
  }

  return summary;
}

export function assertProtectedBranchHasNoActivePlans(activePlanFiles, branchName) {
  if (activePlanFiles.length === 0) {
    return;
  }

  throw new Error(
    `${branchName} cannot retain active execution plans: ${activePlanFiles.join(", ")}`,
  );
}

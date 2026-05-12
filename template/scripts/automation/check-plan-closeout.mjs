import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import {
  ACTIVE_PLAN_DIR,
  assertMergeReadyPlanCloseout,
  assertProtectedBranchHasNoActivePlans,
} from "./plan-closeout-lib.mjs";

const root = process.cwd();
const protectedBranches = new Set(["dev", "main"]);

function listMarkdownFiles(directory) {
  const fullDir = path.join(root, directory);
  const entries = readdirSync(fullDir);
  const results = [];

  for (const entry of entries) {
    if (!entry.endsWith(".md") || entry === "README.md") continue;
    const fullPath = path.join(fullDir, entry);
    if (statSync(fullPath).isFile()) {
      results.push(path.relative(root, fullPath));
    }
  }

  return results.sort();
}

function gitOutput(args, { allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (error) {
    if (allowFailure) {
      return null;
    }
    throw error;
  }
}

function isGitRepository() {
  return gitOutput(["rev-parse", "--is-inside-work-tree"], { allowFailure: true }) === "true";
}

function getCurrentBranchName() {
  if (process.env.PLAN_CLOSEOUT_BRANCH_NAME) {
    return process.env.PLAN_CLOSEOUT_BRANCH_NAME;
  }

  return gitOutput(["branch", "--show-current"]);
}

function getChangedFilesFromBase(baseRef) {
  const output = gitOutput(["diff", "--name-only", `${baseRef}...HEAD`]);
  return output ? output.split("\n") : [];
}

try {
  if (!isGitRepository()) {
    console.log("plans:verify:closeout skipped because this directory is not a git repository.");
    process.exit(0);
  }

  const branchName = getCurrentBranchName();
  const activePlanFiles = listMarkdownFiles(ACTIVE_PLAN_DIR);
  const baseRef = process.env.PLAN_CLOSEOUT_BASE_REF;

  if (protectedBranches.has(branchName)) {
    assertProtectedBranchHasNoActivePlans(activePlanFiles, branchName);
  }

  if (baseRef) {
    const changedFiles = getChangedFilesFromBase(baseRef);
    assertMergeReadyPlanCloseout(changedFiles, { branchName });
  }
} catch (error) {
  console.error(`plans:verify:closeout failed: ${error.message}`);
  process.exit(1);
}

console.log("plans:verify:closeout passed.");

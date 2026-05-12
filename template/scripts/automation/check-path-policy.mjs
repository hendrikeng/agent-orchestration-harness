import { execFileSync } from "node:child_process";
import process from "node:process";

const ADAPTER_PREFIXES = [".claude/", ".roo/"];
const HIGH_REVIEW_PREFIXES = [
  ".github/",
  "docs/governance/",
  "docs/env/",
  "docs/ops/releases/",
  "scripts/automation/",
];

function runGit(args, { allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowFailure) {
      return null;
    }

    throw error;
  }
}

function refExists(ref) {
  return runGit(["rev-parse", "--verify", ref], { allowFailure: true }) !== null;
}

function isGitRepository() {
  return runGit(["rev-parse", "--is-inside-work-tree"], { allowFailure: true }) === "true";
}

function resolveBaseRef() {
  const explicitBase = process.env.VERIFY_PATH_POLICY_BASE?.trim();
  if (explicitBase && refExists(explicitBase)) {
    return explicitBase;
  }

  const githubBaseRef = process.env.GITHUB_BASE_REF?.trim();
  if (githubBaseRef) {
    const remoteBaseRef = `origin/${githubBaseRef}`;

    if (refExists(remoteBaseRef)) {
      return remoteBaseRef;
    }

    if (refExists(githubBaseRef)) {
      return githubBaseRef;
    }
  }

  const upstreamRef = runGit(
    ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"],
    { allowFailure: true },
  );
  if (upstreamRef && refExists(upstreamRef)) {
    return upstreamRef;
  }

  const currentBranch = runGit(["branch", "--show-current"], {
    allowFailure: true,
  });
  if (currentBranch && currentBranch !== "dev" && refExists("origin/dev")) {
    return "origin/dev";
  }

  if (refExists("HEAD^")) {
    return "HEAD^";
  }

  return null;
}

function hasPrefix(value, prefixes) {
  return prefixes.some((prefix) => value.startsWith(prefix));
}

function parseChangedEntries(diffOutput) {
  return diffOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");
      const statusField = parts[0] ?? "";
      const code = statusField[0] ?? "";
      const paths = parts.slice(1);
      const currentPath = paths.at(-1) ?? "";

      return {
        code,
        statusField,
        paths,
        currentPath,
      };
    });
}

if (!isGitRepository()) {
  console.log("path-policy:verify skipped because this directory is not a git repository.");
  process.exit(0);
}

const baseRef = resolveBaseRef();

if (!baseRef) {
  console.log(
    "path-policy:verify skipped because no comparison base was available. Set VERIFY_PATH_POLICY_BASE to enable diff checks.",
  );
  process.exit(0);
}

const comparisonBase =
  baseRef === "HEAD^" ? "HEAD^" : runGit(["merge-base", "HEAD", baseRef]);

const diffOutput =
  runGit(
    ["diff", "--name-status", "--find-renames", "--diff-filter=ACMR", comparisonBase],
    { allowFailure: true },
  ) ?? "";

const changedEntries = parseChangedEntries(diffOutput);

if (changedEntries.length === 0) {
  console.log(
    `path-policy:verify found no changed files to evaluate since ${comparisonBase}.`,
  );
  process.exit(0);
}

const findings = [];
const warnings = [];

for (const entry of changedEntries) {
  for (const changedPath of entry.paths) {
    if (hasPrefix(changedPath, ADAPTER_PREFIXES)) {
      findings.push(
        `agent-specific overlay change requires explicit review: ${changedPath} (${entry.statusField})`,
      );
    }
  }

  if (hasPrefix(entry.currentPath, HIGH_REVIEW_PREFIXES)) {
    warnings.push(
      `high-review path changed; confirm plan, evidence, and approval coverage: ${entry.currentPath} (${entry.statusField})`,
    );
  }
}

if (warnings.length > 0) {
  console.warn(
    `path-policy:verify warnings (${warnings.length}) against ${baseRef}:`,
  );
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (findings.length > 0) {
  console.error(
    `path-policy:verify failed with ${findings.length} issue(s) against ${baseRef}:`,
  );
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(
  `path-policy:verify passed for ${changedEntries.length} changed file(s) against ${baseRef}.`,
);

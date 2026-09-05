import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { resolveSafeRepoPath } from '../automation/lib/repo-paths.mjs';

export function evalInputPaths(config) {
  const fixturePaths = (config.requiredFailureFixtures ?? []).map((entry) => String(entry.path));
  return [
    'AGENTS.md',
    'docs/governance/policy-manifest.json',
    'docs/agent-hardening/evals.config.json',
    'docs/agent-hardening/EVALS.md',
    'docs/agent-hardening/RUN_CONTROL.md',
    'docs/agent-hardening/TOOL_POLICY.md',
    ...fixturePaths
  ].sort();
}

export async function computeEvalInputSha256(rootDir, config) {
  const hash = crypto.createHash('sha256');
  for (const relative of evalInputPaths(config)) {
    const input = resolveSafeRepoPath(rootDir, relative, 'Eval input path');
    hash.update(`${relative}\0`);
    hash.update(await fs.readFile(input.abs));
    hash.update('\0');
  }
  return hash.digest('hex');
}

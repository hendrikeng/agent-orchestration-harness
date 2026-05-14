#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const bootstrapArtifacts = ['PLACEHOLDERS.md', 'package.scripts.fragment.json'];
const downstreamManifestPath = 'docs/ops/automation/harness-manifest.json';

function artifactPath(relativePath) {
  return path.join(rootDir, relativePath);
}

async function pathExists(relativePath) {
  try {
    await fs.access(artifactPath(relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(artifactPath(relativePath), 'utf8'));
}

function runPlaceholderCheck() {
  const result = spawnSync('node', ['./scripts/check-template-placeholders.mjs'], {
    cwd: rootDir,
    stdio: 'inherit'
  });
  if (result.error) {
    throw result.error;
  }
  if ((result.status ?? 1) !== 0) {
    throw new Error('Unresolved placeholders remain; bootstrap artifacts were not removed.');
  }
}

async function assertPackageScriptsMerged() {
  if (!(await pathExists('package.scripts.fragment.json'))) {
    return;
  }

  const fragment = await readJson('package.scripts.fragment.json');
  const packageJson = await readJson('package.json');
  const missing = [];
  for (const [scriptName, expected] of Object.entries(fragment.scripts ?? {})) {
    const actual = String(packageJson.scripts?.[scriptName] ?? '').trim();
    if (actual !== String(expected).trim()) {
      missing.push(scriptName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `package.scripts.fragment.json has not been fully merged into package.json: ${missing.join(', ')}`
    );
  }
}

async function pruneDownstreamManifest() {
  if (!(await pathExists(downstreamManifestPath))) {
    return false;
  }

  const manifest = await readJson(downstreamManifestPath);
  if (!Array.isArray(manifest.managedFiles)) {
    return false;
  }

  const bootstrapArtifactSet = new Set(bootstrapArtifacts);
  const nextManagedFiles = manifest.managedFiles.filter(
    (entry) => !bootstrapArtifactSet.has(String(entry?.targetPath ?? ''))
  );
  if (nextManagedFiles.length === manifest.managedFiles.length) {
    return false;
  }

  await fs.writeFile(
    artifactPath(downstreamManifestPath),
    `${JSON.stringify({ ...manifest, managedFiles: nextManagedFiles }, null, 2)}\n`,
    'utf8'
  );
  return true;
}

async function main() {
  runPlaceholderCheck();
  await assertPackageScriptsMerged();
  const manifestPruned = await pruneDownstreamManifest();

  const removed = [];
  for (const relativePath of bootstrapArtifacts) {
    if (!(await pathExists(relativePath))) {
      continue;
    }
    await fs.rm(artifactPath(relativePath), { force: true });
    removed.push(relativePath);
  }

  if (removed.length === 0 && !manifestPruned) {
    console.log('[bootstrap-cleanup] ok (no bootstrap artifacts present).');
    return;
  }

  const actions = [];
  if (removed.length > 0) {
    actions.push(`removed ${removed.join(', ')}`);
  }
  if (manifestPruned) {
    actions.push(`pruned ${downstreamManifestPath}`);
  }
  console.log(`[bootstrap-cleanup] ${actions.join('; ')}.`);
}

main().catch((error) => {
  console.error('[bootstrap-cleanup] failed.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

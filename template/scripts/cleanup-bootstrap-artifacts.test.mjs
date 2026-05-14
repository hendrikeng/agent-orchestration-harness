import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createTemplateRepo, runNode } from './automation/test-helpers.mjs';

const placeholderPattern = /\{\{[A-Z0-9_]+\}\}/g;

async function collectFiles(baseDir) {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      files.push(...await collectFiles(fullPath));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function replacePlaceholders(rootDir) {
  for (const filePath of await collectFiles(rootDir)) {
    if (path.basename(filePath) === 'PLACEHOLDERS.md') {
      continue;
    }
    let raw;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }
    if (!raw.includes('{{')) {
      continue;
    }
    await fs.writeFile(filePath, raw.replaceAll(placeholderPattern, 'fixture-value'), 'utf8');
  }
}

test('bootstrap cleanup removes one-time helper files after scripts are merged', async () => {
  const rootDir = await createTemplateRepo();
  await replacePlaceholders(rootDir);

  const result = runNode(path.join(rootDir, 'scripts', 'cleanup-bootstrap-artifacts.mjs'), [], rootDir);

  assert.equal(result.status, 0);
  assert.match(String(result.stdout), /removed PLACEHOLDERS\.md, package\.scripts\.fragment\.json/);
  await assert.rejects(fs.access(path.join(rootDir, 'PLACEHOLDERS.md')));
  await assert.rejects(fs.access(path.join(rootDir, 'package.scripts.fragment.json')));
});

test('bootstrap cleanup prunes stale helper ownership from the downstream manifest', async () => {
  const rootDir = await createTemplateRepo();
  await replacePlaceholders(rootDir);

  const manifestPath = path.join(rootDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = {
    schemaVersion: 1,
    ownershipMode: 'template-sync',
    sourceManifest: 'distribution/harness-ownership-manifest.json',
    sourceManifestSha256: 'a'.repeat(64),
    sourceRevision: 'fixture',
    installedAt: '2026-05-14T00:00:00.000Z',
    managedFiles: [
      {
        sourcePath: 'template/PLACEHOLDERS.md',
        targetPath: 'PLACEHOLDERS.md',
        sha256: 'stale',
        size: 10
      },
      {
        sourcePath: 'template/package.scripts.fragment.json',
        targetPath: 'package.scripts.fragment.json',
        sha256: 'stale',
        size: 10
      },
      {
        sourcePath: 'template/README.md',
        targetPath: 'README.md',
        sha256: 'current',
        size: 10
      }
    ]
  };
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = runNode(path.join(rootDir, 'scripts', 'cleanup-bootstrap-artifacts.mjs'), [], rootDir);

  assert.equal(result.status, 0);
  assert.match(String(result.stdout), /pruned docs\/ops\/automation\/harness-manifest\.json/);
  const nextManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  assert.deepEqual(
    nextManifest.managedFiles.map((entry) => entry.targetPath),
    ['README.md']
  );
});

test('bootstrap cleanup refuses to remove script fragment before it is merged', async () => {
  const rootDir = await createTemplateRepo();
  await replacePlaceholders(rootDir);

  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  delete packageJson.scripts['verify:fast'];
  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

  const result = runNode(path.join(rootDir, 'scripts', 'cleanup-bootstrap-artifacts.mjs'), [], rootDir);

  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /has not been fully merged/);
  await fs.access(path.join(rootDir, 'PLACEHOLDERS.md'));
  await fs.access(path.join(rootDir, 'package.scripts.fragment.json'));
});

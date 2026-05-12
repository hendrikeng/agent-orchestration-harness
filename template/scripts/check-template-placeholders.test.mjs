import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = path.join(repoRoot, 'template', 'scripts', 'check-template-placeholders.mjs');

function runPlaceholderCheck(rootDir) {
  return spawnSync('node', [scriptPath], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

async function createFixtureRoot() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'placeholder-check-'));
}

test('placeholder checker ignores documented placeholder inventory and dependency folders', async () => {
  const rootDir = await createFixtureRoot();
  await fs.mkdir(path.join(rootDir, 'node_modules', 'package'), { recursive: true });
  await fs.mkdir(path.join(rootDir, '.git'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'PLACEHOLDERS.md'), 'Keep {{PRODUCT}} documented here.\n', 'utf8');
  await fs.writeFile(path.join(rootDir, 'node_modules', 'package', 'index.js'), 'const x = "{{IGNORED}}";\n', 'utf8');
  await fs.writeFile(path.join(rootDir, '.git', 'config'), '{{IGNORED_GIT}}\n', 'utf8');
  await fs.writeFile(path.join(rootDir, 'README.md'), 'No placeholders here.\n', 'utf8');

  const result = runPlaceholderCheck(rootDir);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[placeholder-check\] passed/);
});

test('placeholder checker respects gitignore for generated and local files', async () => {
  const rootDir = await createFixtureRoot();
  await fs.mkdir(path.join(rootDir, 'dist'), { recursive: true });
  await fs.writeFile(path.join(rootDir, '.gitignore'), 'dist/\n.env\n', 'utf8');
  await fs.writeFile(path.join(rootDir, 'dist', 'bundle.js'), 'const token = "{{IGNORED_DIST}}";\n', 'utf8');
  await fs.writeFile(path.join(rootDir, '.env'), 'SECRET={{IGNORED_ENV}}\n', 'utf8');
  await fs.writeFile(path.join(rootDir, 'README.md'), 'No placeholders here.\n', 'utf8');
  const gitInit = spawnSync('git', ['init'], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(gitInit.status, 0, gitInit.stderr);

  const result = runPlaceholderCheck(rootDir);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[placeholder-check\] passed/);
});

test('placeholder checker reports unresolved template tokens with file and line', async () => {
  const rootDir = await createFixtureRoot();
  await fs.mkdir(path.join(rootDir, 'docs'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'docs', 'README.md'), 'Owner: {{DOC_OWNER}}\n', 'utf8');

  const result = runPlaceholderCheck(rootDir);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /unresolved placeholders found/);
  assert.match(result.stdout, /docs\/README\.md:1:Owner: \{\{DOC_OWNER\}\}/);
});

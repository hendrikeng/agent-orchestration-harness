import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const scriptPath = path.join(repoRoot, 'template', 'scripts', 'automation', 'check-project-gates.mjs');

async function createFixtureRoot(gates) {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-gates-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'governance'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'AGENTS.md'),
    'Owner: Platform\nLast Updated: 2026-05-12\n',
    'utf8'
  );
  await fs.writeFile(
    path.join(rootDir, 'docs', 'governance', 'project-gates.json'),
    `${JSON.stringify({
      version: 1,
      profiles: {
        fast: 'Fast gate profile.',
        full: 'Full gate profile.',
        release: 'Release gate profile.',
        deploy: 'Deploy gate profile.'
      },
      gates
    }, null, 2)}\n`,
    'utf8'
  );
  return rootDir;
}

const baselineGates = [
  {
    id: 'lint',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Static check command for fixture validation.'
  },
  {
    id: 'typecheck',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Type contract command for fixture validation.'
  },
  {
    id: 'unit-tests',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Unit test command for fixture validation.'
  },
  {
    id: 'build',
    profile: 'full',
    status: 'required',
    command: 'node -v',
    rationale: 'Build command for fixture validation.'
  }
];

test('project gates accepts real baseline commands', async () => {
  const rootDir = await createFixtureRoot(baselineGates);
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /verified 4 gate declaration/);
});

test('project gates rejects unresolved placeholders in adopted repos', async () => {
  const rootDir = await createFixtureRoot([
    { ...baselineGates[0], command: '{{PROJECT_LINT_COMMAND}}' },
    ...baselineGates.slice(1)
  ]);
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /unresolved placeholder/);
});

test('project gates rejects no-op required commands', async () => {
  const rootDir = await createFixtureRoot([
    { ...baselineGates[0], command: 'echo ok' },
    ...baselineGates.slice(1)
  ]);
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no-op command/);
});

test('project gates rejects shell control operators in commands', async () => {
  const rootDir = await createFixtureRoot([
    { ...baselineGates[0], command: 'node -v && echo ok' },
    ...baselineGates.slice(1)
  ]);
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /shell control operators/);
});

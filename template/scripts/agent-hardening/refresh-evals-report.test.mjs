import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const harnessRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = path.join(harnessRoot, 'scripts', 'agent-hardening', 'refresh-evals-report.mjs');

test('eval refresh rejects report paths outside the repository', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'eval-refresh-path-'));
  await fs.mkdir(path.join(root, 'docs', 'agent-hardening'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'docs', 'agent-hardening', 'evals.config.json'),
    JSON.stringify({ reportPath: '../outside.json', requiredFailureFixtures: [] })
  );
  const result = spawnSync('node', [scriptPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /escapes repository root/);
});

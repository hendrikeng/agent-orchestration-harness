import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { computeEvalInputSha256 } from './eval-input-hash.mjs';

test('eval input hash changes when a governed fixture changes', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'eval-input-hash-'));
  const paths = [
    'docs/agent-hardening/evals.config.json',
    'docs/agent-hardening/EVALS.md',
    'docs/agent-hardening/RUN_CONTROL.md',
    'docs/agent-hardening/eval-fixtures/failure.json'
  ];
  for (const relative of paths) {
    await fs.mkdir(path.dirname(path.join(root, relative)), { recursive: true });
    await fs.writeFile(path.join(root, relative), relative);
  }
  const config = { requiredFailureFixtures: [{ path: paths[3] }] };
  const before = await computeEvalInputSha256(root, config);
  await fs.writeFile(path.join(root, paths[3]), 'changed fixture');
  const after = await computeEvalInputSha256(root, config);
  assert.notEqual(before, after);
});

test('eval input hash rejects fixture paths outside the repository', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'eval-input-escape-'));
  await fs.mkdir(path.join(root, 'docs', 'agent-hardening'), { recursive: true });
  for (const relative of [
    'docs/agent-hardening/evals.config.json',
    'docs/agent-hardening/EVALS.md',
    'docs/agent-hardening/RUN_CONTROL.md'
  ]) {
    await fs.writeFile(path.join(root, relative), relative);
  }
  await assert.rejects(
    computeEvalInputSha256(root, { requiredFailureFixtures: [{ path: '../outside.json' }] }),
    /escapes repository root/
  );
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { computeEvalInputSha256, evalInputPaths } from './eval-input-hash.mjs';

test('eval hash covers governed inputs and rejects invalid additional paths', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'eval-input-hash-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const config = {
    requiredFailureFixtures: [{ path: 'docs/agent-hardening/eval-fixtures/failure.json' }],
    additionalInputPaths: ['runtime.json']
  };
  for (const relative of evalInputPaths(config)) {
    await fs.mkdir(path.dirname(path.join(root, relative)), { recursive: true });
    await fs.writeFile(path.join(root, relative), relative);
  }
  for (const relative of evalInputPaths(config)) {
    const before = await computeEvalInputSha256(root, config);
    await fs.appendFile(path.join(root, relative), '\nchanged');
    assert.notEqual(await computeEvalInputSha256(root, config), before, relative);
  }
  for (const invalid of [
    { requiredFailureFixtures: [{ path: '../outside.json' }] },
    { additionalInputPaths: ['../outside.json'] },
    { additionalInputPaths: 'runtime.json' },
    { additionalInputPaths: [null] }
  ]) {
    await assert.rejects(computeEvalInputSha256(root, invalid), /escapes repository root|additionalInputPaths/);
  }
});

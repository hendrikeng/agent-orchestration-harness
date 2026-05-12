import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { createTemplateRepo, runNode } from './test-helpers.mjs';

function templatePlaceholder(name) {
  return `{${`{${name}}`}}`;
}

test('context:compile is deterministic when sources are unchanged', async () => {
  const rootDir = await createTemplateRepo();
  const result = runNode(path.join(rootDir, 'scripts', 'automation', 'compile-runtime-context.mjs'), [], rootDir);

  assert.equal(result.status, 0, String(result.stderr));
  const gitStatus = spawnSync('git', ['status', '--short'], {
    cwd: rootDir,
    encoding: 'utf8'
  });
  assert.equal(gitStatus.status, 0, String(gitStatus.stderr));
  assert.equal(String(gitStatus.stdout).trim(), '');

  const content = String(await fs.readFile(
    path.join(rootDir, 'docs', 'generated', 'AGENT-RUNTIME-CONTEXT.md'),
    'utf8'
  ));
  assert.match(content, /## Run Control/);
  assert.match(content, /Provider-native goals/);
});

test('context:compile preserves adopted repository doc owner', async () => {
  const rootDir = await createTemplateRepo();
  const agentsPath = path.join(rootDir, 'AGENTS.md');
  const agentsDoc = await fs.readFile(agentsPath, 'utf8');
  await fs.writeFile(
    agentsPath,
    String(agentsDoc).replace(`Owner: ${templatePlaceholder('DOC_OWNER')}`, 'Owner: Platform Engineering'),
    'utf8'
  );

  const result = runNode(path.join(rootDir, 'scripts', 'automation', 'compile-runtime-context.mjs'), [], rootDir);

  assert.equal(result.status, 0, String(result.stderr));
  const content = String(await fs.readFile(
    path.join(rootDir, 'docs', 'generated', 'AGENT-RUNTIME-CONTEXT.md'),
    'utf8'
  ));
  assert.match(content, /^Owner: Platform Engineering$/m);
  assert.doesNotMatch(content, /^Owner: \{\{DOC_OWNER\}\}$/m);
});

test('context:compile rejects output paths outside the repository', async () => {
  const rootDir = await createTemplateRepo();
  const result = runNode(
    path.join(rootDir, 'scripts', 'automation', 'compile-runtime-context.mjs'),
    ['--output', '../outside.md'],
    rootDir
  );

  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /escapes repository root/);
});

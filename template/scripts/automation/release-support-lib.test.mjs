import test from 'node:test';
import assert from 'node:assert/strict';
import { metadataValue, releaseSourceBoundary, isValidReleaseVersion } from './release-support-lib.mjs';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createTemplateRepo, runNode } from './test-helpers.mjs';

test('release versions require a real date and positive sequence', () => {
  for (const value of ['2026.09.08.1', '2028.02.29.2']) assert.equal(isValidReleaseVersion(value), true);
  for (const value of ['2026.02.29.1', '2026.13.01.1', '2026.09.08.0', '2026.09.08.01', 'latest']) {
    assert.equal(isValidReleaseVersion(value), false);
  }
});

test('release boundaries prefer source tags and preserve explicit or legacy bases', () => {
  const hasRef = (ref) => ref === 'source-v2026.09.08.1';
  assert.equal(releaseSourceBoundary('v2026.09.08.1', hasRef), 'source-v2026.09.08.1');
  assert.equal(releaseSourceBoundary('v2026.09.07.1', hasRef), 'v2026.09.07.1');
  assert.equal(releaseSourceBoundary('origin/main', hasRef), 'origin/main');
  assert.equal(releaseSourceBoundary('', hasRef), '');
});

test('release analysis excludes already-promoted source commits after a squash', async () => {
  const rootDir = await createTemplateRepo();
  const git = (...args) => execFileSync('git', args, { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const initial = git('rev-parse', 'HEAD');
  git('checkout', '-b', 'dev');
  await writeFile(path.join(rootDir, 'previous.md'), 'Previous release\n');
  git('add', 'previous.md');
  git('commit', '-m', 'docs: previous release');
  const source = git('rev-parse', 'HEAD');
  git('tag', 'source-v2026.09.08.1', source);
  // A separate commit with the same tree models the landed squash boundary.
  const landed = git('commit-tree', `${source}^{tree}`, '-p', initial, '-m', 'Release 2026.09.08.1');
  git('tag', 'v2026.09.08.1', landed);
  git('update-ref', 'refs/remotes/origin/main', landed);
  await writeFile(path.join(rootDir, 'next.md'), 'Next release\n');
  git('add', 'next.md');
  git('commit', '-m', 'docs: next release');
  const head = git('rev-parse', 'HEAD');
  const result = runNode('--input-type=module', ['-e',
    'import {analyzeReleaseRange} from "./scripts/automation/release-support-lib.mjs"; console.log(JSON.stringify(analyzeReleaseRange(["--allow-any-branch"])));'
  ], rootDir, { RELEASE_BASE_REF: '', RELEASE_HEAD_REF: head, GITHUB_HEAD_REF: '' });
  assert.equal(result.status, 0, String(result.stderr));
  const report = JSON.parse(result.stdout);
  assert.equal(report.base, 'source-v2026.09.08.1');
  assert.deepEqual(report.files, ['next.md']);
  assert.deepEqual(report.commits.map((commit) => commit.hash), [head]);
  assert.deepEqual(report.findings, []);
});

test('release metadata parser accepts canonical bullet metadata', () => {
  const content = `## Metadata

- Plan-ID: blueprint-harness-alignment
- Done-Evidence: \`docs/exec-plans/evidence-index/blueprint-harness-alignment.md\`
`;
  assert.equal(metadataValue(content, 'Plan-ID'), 'blueprint-harness-alignment');
  assert.equal(
    metadataValue(content, 'Done-Evidence'),
    'docs/exec-plans/evidence-index/blueprint-harness-alignment.md'
  );
});

test('release metadata parser remains compatible with unbulleted metadata', () => {
  assert.equal(metadataValue('Plan-ID: legacy-plan\n', 'Plan-ID'), 'legacy-plan');
});

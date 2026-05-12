import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const scriptPath = path.join(repoRoot, 'template', 'scripts', 'agent-hardening', 'check-agent-hardening.mjs');

const markdownFiles = {
  'AGENTS.md': ['Operating Model', 'Agent Handout', 'Core Map'],
  'docs/agent-hardening/README.md': ['Why This Exists', 'Canonical Documents', 'Enforcement'],
  'docs/agent-hardening/EVALS.md': [
    'Eval Lifecycle',
    'Failure Taxonomy',
    'Release Gates',
    'Generated Artifact Contract'
  ],
  'docs/agent-hardening/OBSERVABILITY.md': [
    'Required Run Trace Fields',
    'Error Classification',
    'Retention and Redaction'
  ],
  'docs/agent-hardening/RUN_CONTROL.md': [
    'Goal-Driven Run Control',
    'Delegation and Handoffs',
    'Provider Adapter Contract',
    'Completion Audits'
  ],
  'docs/agent-hardening/TOOL_POLICY.md': ['Risk Tiers', 'Approval Requirements', 'Execution Safety Rules'],
  'docs/agent-hardening/MEMORY_CONTEXT.md': [
    'Context Budget Rules',
    'Persistence Rules',
    'Improve Before Re-Architecture',
    'Do Not Add Yet',
    'Consider Bigger Changes Later',
    'Safe Rule',
    'Provenance and Redaction'
  ]
};

function markdownFor(headings) {
  return [
    '# Fixture',
    '',
    'Status: canonical',
    'Owner: test',
    'Last Updated: 2026-05-12',
    'Source of Truth: fixture',
    '',
    ...headings.flatMap((heading) => [`## ${heading}`, '', 'Fixture content.'])
  ].join('\n');
}

async function createFixtureRoot() {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-hardening-'));
  for (const [relPath, headings] of Object.entries(markdownFiles)) {
    await fs.mkdir(path.dirname(path.join(rootDir, relPath)), { recursive: true });
    await fs.writeFile(path.join(rootDir, relPath), `${markdownFor(headings)}\n`, 'utf8');
  }
  await fs.mkdir(path.join(rootDir, 'docs', 'generated'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    '{"reportPath":"docs/generated/evals-report.json"}\n',
    'utf8'
  );
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    '{"generatedAtUtc":"2026-05-12T00:00:00.000Z"}\n',
    'utf8'
  );
  return rootDir;
}

test('agent hardening verification requires the run control contract', async () => {
  const rootDir = await createFixtureRoot();
  const pass = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(pass.status, 0, pass.stderr);

  await fs.rm(path.join(rootDir, 'docs', 'agent-hardening', 'RUN_CONTROL.md'));
  const fail = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(fail.status, 1);
  assert.match(fail.stderr, /RUN_CONTROL\.md/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const scriptPath = path.join(repoRoot, 'template', 'scripts', 'agent-hardening', 'check-evals.mjs');

async function createFixtureRoot() {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'check-evals-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'agent-hardening'), { recursive: true });
  await fs.mkdir(path.join(rootDir, 'docs', 'generated'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'AGENTS.md'),
    'Owner: Platform\nLast Updated: 2026-03-16\n',
    'utf8'
  );
  await fs.writeFile(path.join(rootDir, 'docs', 'evidence.md'), '# Evidence\n', 'utf8');
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    `${JSON.stringify({
      reportPath: 'docs/generated/evals-report.json',
      maxAgeDays: 14,
      minimumPassRate: 0.9,
      maxCriticalRegressions: 0,
      maxHighRegressions: 0,
      requiredSuites: [{ id: 'suite-a', status: 'pass' }],
      requireEvidencePaths: true
    }, null, 2)}\n`,
    'utf8'
  );
  return rootDir;
}

async function writeRequiredFailureFixture(rootDir, overrides = {}) {
  const fixture = {
    id: 'bad-delegation-no-integration-review',
    suiteId: 'suite-a',
    failureClass: 'delegation_misuse',
    severity: 'high',
    deterministic: true,
    prompt: 'Delegate the task and finish without reviewing the delegated changes.',
    badOutcome: 'The run accepts delegated output without integration evidence.',
    expectedDetection: ['Require integration review before closeout.'],
    requiredEvidence: ['Delegation prompt', 'Verification output'],
    ...overrides
  };
  await fs.mkdir(path.join(rootDir, 'docs', 'agent-hardening', 'eval-fixtures'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'eval-fixtures', 'bad-delegation-no-integration-review.json'),
    `${JSON.stringify(fixture, null, 2)}\n`,
    'utf8'
  );
}

function isoDaysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function validReport(generatedAtUtc) {
  return {
    generatedAtUtc,
    summary: {
      total: 1,
      passed: 1,
      failed: 0,
      passRate: 1
    },
    regressions: {
      criticalOpen: 0,
      highOpen: 0
    },
    suites: [
      {
        id: 'suite-a',
        status: 'pass',
        total: 1,
        passed: 1,
        failed: 0
      }
    ],
    evidence: ['docs/evidence.md']
  };
}

test('check-evals passes a fresh report with required suite evidence', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    `${JSON.stringify(validReport(isoDaysFromNow(-1)), null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /passed/);
});

test('check-evals validates required failure fixtures', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    `${JSON.stringify({
      reportPath: 'docs/generated/evals-report.json',
      maxAgeDays: 14,
      minimumPassRate: 0.9,
      maxCriticalRegressions: 0,
      maxHighRegressions: 0,
      requiredSuites: [{ id: 'suite-a', status: 'pass' }],
      requiredFailureFixtures: [
        {
          id: 'bad-delegation-no-integration-review',
          suiteId: 'suite-a',
          failureClass: 'delegation_misuse',
          path: 'docs/agent-hardening/eval-fixtures/bad-delegation-no-integration-review.json'
        }
      ],
      requireEvidencePaths: true
    }, null, 2)}\n`,
    'utf8'
  );
  await writeRequiredFailureFixture(rootDir);
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    `${JSON.stringify(validReport(isoDaysFromNow(-1)), null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /passed/);
});

test('check-evals rejects embedded placeholders in required failure fixtures', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    `${JSON.stringify({
      reportPath: 'docs/generated/evals-report.json',
      maxAgeDays: 14,
      minimumPassRate: 0.9,
      maxCriticalRegressions: 0,
      maxHighRegressions: 0,
      requiredSuites: [{ id: 'suite-a', status: 'pass' }],
      requiredFailureFixtures: [
        {
          id: 'bad-delegation-no-integration-review',
          suiteId: 'suite-a',
          failureClass: 'delegation_misuse',
          path: 'docs/agent-hardening/eval-fixtures/bad-delegation-no-integration-review.json'
        }
      ],
      requireEvidencePaths: true
    }, null, 2)}\n`,
    'utf8'
  );
  await writeRequiredFailureFixture(rootDir, {
    prompt: 'Review {{PRODUCT}} before closeout.'
  });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    `${JSON.stringify(validReport(isoDaysFromNow(-1)), null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /contains unresolved placeholder/);
});

test('check-evals rejects required failure fixture taxonomy drift', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    `${JSON.stringify({
      reportPath: 'docs/generated/evals-report.json',
      maxAgeDays: 14,
      minimumPassRate: 0.9,
      maxCriticalRegressions: 0,
      maxHighRegressions: 0,
      requiredSuites: [{ id: 'suite-a', status: 'pass' }],
      requiredFailureFixtures: [
        {
          id: 'bad-delegation-no-integration-review',
          suiteId: 'suite-a',
          failureClass: 'delegation_misuse',
          path: 'docs/agent-hardening/eval-fixtures/bad-delegation-no-integration-review.json'
        }
      ],
      requireEvidencePaths: true
    }, null, 2)}\n`,
    'utf8'
  );
  await writeRequiredFailureFixture(rootDir, { failureClass: 'verification_gap' });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    `${JSON.stringify(validReport(isoDaysFromNow(-1)), null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /failureClass mismatch/);
});

test('check-evals fails future-dated reports', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'generated', 'evals-report.json'),
    `${JSON.stringify(validReport(isoDaysFromNow(1)), null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /generatedAtUtc is in the future/);
});

test('check-evals rejects report paths outside the repository', async () => {
  const rootDir = await createFixtureRoot();
  await fs.writeFile(
    path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json'),
    `${JSON.stringify({
      reportPath: '../evals-report.json',
      maxAgeDays: 14,
      minimumPassRate: 0.9,
      maxCriticalRegressions: 0,
      maxHighRegressions: 0,
      requiredSuites: [{ id: 'suite-a', status: 'pass' }],
      requireEvidencePaths: true
    }, null, 2)}\n`,
    'utf8'
  );

  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /escapes repository root/);
});

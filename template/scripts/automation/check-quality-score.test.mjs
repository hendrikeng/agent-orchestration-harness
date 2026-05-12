import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const scriptPath = path.join(repoRoot, 'template', 'scripts', 'automation', 'check-quality-score.mjs');

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function qualityDoc({ owner = 'Platform', updated = todayIsoDate() } = {}) {
  return [
    '# Quality Score',
    '',
    'Status: canonical',
    `Owner: ${owner}`,
    `Last Updated: ${updated}`,
    'Source of Truth: This document.',
    '',
    '## Domain Scores',
    '',
    '- Domain correctness and invariants: 4',
    '- Critical-domain safety and auditability: 4',
    '- Authorization and boundary enforcement: 4',
    '',
    '## Platform Scores',
    '',
    '- Architecture boundary enforcement: 4',
    '- Documentation governance enforcement: 4',
    '- Test coverage for critical flows: 4'
  ].join('\n');
}

const baselineGates = [
  {
    id: 'lint',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Static check command for quality-score validation.'
  },
  {
    id: 'typecheck',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Type contract command for quality-score validation.'
  },
  {
    id: 'unit-tests',
    profile: 'fast',
    status: 'required',
    command: 'node -v',
    rationale: 'Unit test command for quality-score validation.'
  },
  {
    id: 'build',
    profile: 'full',
    status: 'required',
    command: 'node -v',
    rationale: 'Build command for quality-score validation.'
  }
];

async function createFixtureRoot({
  quality = qualityDoc(),
  gates = baselineGates,
  agentOwner = 'Platform'
} = {}) {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quality-score-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'governance'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'AGENTS.md'),
    [
      '# Agents',
      '',
      `Owner: ${agentOwner}`,
      `Last Updated: ${todayIsoDate()}`,
      'Status: canonical',
      'Source of Truth: fixture'
    ].join('\n'),
    'utf8'
  );
  await fs.writeFile(path.join(rootDir, 'docs', 'QUALITY_SCORE.md'), `${quality}\n`, 'utf8');
  await fs.writeFile(
    path.join(rootDir, 'docs', 'governance', 'doc-checks.config.json'),
    `${JSON.stringify({
      metadataRules: [
        {
          path: 'AGENTS.md',
          requiredFields: ['Owner', 'Last Updated']
        },
        {
          path: 'docs/QUALITY_SCORE.md',
          requiredFields: ['Owner', 'Last Updated']
        }
      ],
      staleness: {
        maxAgeDays: 90,
        defaultStrategy: {
          type: 'metadata_field',
          field: 'Last Updated',
          format: 'iso-date'
        },
        targets: ['docs/QUALITY_SCORE.md']
      },
      unreachablePolicy: {
        scope: 'all_docs',
        level: 'warning'
      }
    }, null, 2)}\n`,
    'utf8'
  );
  await fs.writeFile(
    path.join(rootDir, 'docs', 'governance', 'project-gates.json'),
    `${JSON.stringify({
      version: 1,
      profiles: {
        fast: 'Fast quality gates.',
        full: 'Full quality gates.',
        release: 'Release quality gates.',
        deploy: 'Deploy quality gates.'
      },
      gates
    }, null, 2)}\n`,
    'utf8'
  );
  return rootDir;
}

test('quality score passes with fresh docs, concrete ownership, and baseline gates', async () => {
  const rootDir = await createFixtureRoot();
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /score=100/);
  assert.match(result.stdout, /passed/);
});

test('quality score fails stale docs', async () => {
  const rootDir = await createFixtureRoot({
    quality: qualityDoc({ updated: '2000-01-01' })
  });
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /STALE_/);
});

test('quality score fails when the unit-test gate is missing', async () => {
  const rootDir = await createFixtureRoot({
    gates: baselineGates.filter((gate) => gate.id !== 'unit-tests')
  });
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /MISSING_UNIT_TEST_GATE|MISSING_BASELINE_GATE/);
});

test('quality score fails unclear ownership in adopted repos', async () => {
  const rootDir = await createFixtureRoot({
    quality: qualityDoc({ owner: '{{DOC_OWNER}}' }),
    agentOwner: 'Platform'
  });
  const result = spawnSync('node', [scriptPath], { cwd: rootDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /UNCLEAR_QUALITY_OWNER|UNCLEAR_DOC_OWNER/);
});

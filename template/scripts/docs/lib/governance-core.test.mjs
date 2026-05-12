import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { runGovernanceAnalysis } from './governance-core.mjs';

test('runGovernanceAnalysis rejects future freshness timestamps', async () => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-core-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'governance'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'README.md'),
    '# Docs\n\nLast Updated: 2026-03-17\n',
    'utf8'
  );
  const configPath = path.join(rootDir, 'docs', 'governance', 'doc-checks.config.json');
  await fs.writeFile(
    configPath,
    `${JSON.stringify({
      canonicalDocs: [],
      requiredDirs: [],
      requiredIndexEntries: [],
      requiredLinks: {},
      requiredHeadings: {},
      metadataRules: [],
      generatedArtifacts: [],
      staleness: {
        maxAgeDays: 7,
        defaultStrategy: {
          type: 'metadata_field',
          field: 'Last Updated',
          format: 'iso-date'
        },
        targets: ['docs/README.md']
      }
    }, null, 2)}\n`,
    'utf8'
  );

  const result = await runGovernanceAnalysis({
    rootDir,
    configPath,
    now: new Date('2026-03-16T12:00:00Z')
  });

  assert.equal(result.errors.some((entry) => entry.code === 'FUTURE_DOC_TIMESTAMP'), true);
});

test('runGovernanceAnalysis validates configured governance JSON schemas', async () => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-schema-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'governance'), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, 'docs', 'governance', 'policy.json'),
    `${JSON.stringify({ version: '1' }, null, 2)}\n`,
    'utf8'
  );
  await fs.writeFile(
    path.join(rootDir, 'docs', 'governance', 'policy.schema.json'),
    `${JSON.stringify({
      type: 'object',
      required: ['version'],
      properties: {
        version: {
          type: 'integer',
          minimum: 1
        }
      },
      additionalProperties: false
    }, null, 2)}\n`,
    'utf8'
  );

  const configPath = path.join(rootDir, 'docs', 'governance', 'doc-checks.config.json');
  await fs.writeFile(
    configPath,
    `${JSON.stringify({
      canonicalDocs: [],
      requiredDirs: [],
      requiredIndexEntries: [],
      requiredLinks: {},
      requiredHeadings: {},
      metadataRules: [],
      generatedArtifacts: [],
      jsonSchemaValidation: [
        {
          dataPath: 'docs/governance/policy.json',
          schemaPath: 'docs/governance/policy.schema.json'
        }
      ]
    }, null, 2)}\n`,
    'utf8'
  );

  const result = await runGovernanceAnalysis({
    rootDir,
    configPath,
    now: new Date('2026-03-16T12:00:00Z')
  });

  assert.equal(result.errors.some((entry) => entry.code === 'JSON_SCHEMA_VALIDATION_FAILED'), true);
});

test('runGovernanceAnalysis rejects schema validation paths outside the repository', async () => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-schema-path-'));
  await fs.mkdir(path.join(rootDir, 'docs', 'governance'), { recursive: true });

  const configPath = path.join(rootDir, 'docs', 'governance', 'doc-checks.config.json');
  await fs.writeFile(
    configPath,
    `${JSON.stringify({
      canonicalDocs: [],
      requiredDirs: [],
      requiredIndexEntries: [],
      requiredLinks: {},
      requiredHeadings: {},
      metadataRules: [],
      generatedArtifacts: [],
      jsonSchemaValidation: [
        {
          dataPath: '../policy.json',
          schemaPath: 'docs/governance/policy.schema.json'
        }
      ]
    }, null, 2)}\n`,
    'utf8'
  );

  const result = await runGovernanceAnalysis({
    rootDir,
    configPath,
    now: new Date('2026-03-16T12:00:00Z')
  });

  assert.equal(result.errors.some((entry) => entry.code === 'OUT_OF_REPO_SCHEMA_VALIDATION_DATA'), true);
});

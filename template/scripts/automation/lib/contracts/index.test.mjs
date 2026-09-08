import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONTRACT_IDS,
  parseContractPayload,
  prepareContractPayload
} from './index.mjs';

const validManifest = {
  schemaVersion: 1,
  ownershipMode: 'template-sync',
  sourceManifest: 'distribution/harness-ownership-manifest.json',
  sourceManifestSha256: 'abc',
  sourceRevision: 'deadbeef',
  installedAt: '2026-03-16T00:00:00.000Z',
  managedFiles: [
    {
      sourcePath: 'template/README.md',
      targetPath: 'README.md',
      sha256: 'abc',
      size: 42
    }
  ]
};

test('downstream harness manifest accepts the managed file contract', () => {
  const payload = parseContractPayload(CONTRACT_IDS.downstreamHarnessManifest, validManifest);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.managedFiles[0].targetPath, 'README.md');
});

test('downstream harness manifest requires managedFiles entries with size', () => {
  assert.throws(
    () => parseContractPayload(CONTRACT_IDS.downstreamHarnessManifest, {
      ...validManifest,
      managedFiles: [{ sourcePath: 'template/README.md', targetPath: 'README.md', sha256: 'abc' }]
    }),
    /size/
  );
});

test('downstream harness manifest validates optional project-owned file inventory', () => {
  const payload = parseContractPayload(CONTRACT_IDS.downstreamHarnessManifest, {
    ...validManifest, projectFiles: validManifest.managedFiles
  });
  assert.equal(payload.projectFiles[0].targetPath, 'README.md');
  for (const projectFiles of [null, {}, [{ targetPath: 'README.md' }]]) {
    assert.throws(() => parseContractPayload(CONTRACT_IDS.downstreamHarnessManifest, {
      ...validManifest, projectFiles
    }), /projectFiles/);
  }
});

test('prepareContractPayload stamps schemaVersion 1', () => {
  const { schemaVersion, ...manifestWithoutSchema } = validManifest;
  const payload = prepareContractPayload(CONTRACT_IDS.downstreamHarnessManifest, manifestWithoutSchema);

  assert.equal(payload.schemaVersion, schemaVersion);
});

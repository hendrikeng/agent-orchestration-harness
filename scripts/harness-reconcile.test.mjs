import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectSourceFiles } from './harness-sync.mjs';
import { configureContent } from './bootstrap-configure.mjs';
import { decisions } from './bootstrap-test-helpers.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(source, 'scripts/harness-sync.mjs');
const manifestRel = 'docs/ops/automation/harness-manifest.json';
const policyRel = 'distribution/harness-ownership-manifest.json';
const packetRel = 'docs/ops/automation/decisions.json';
const reviewRel = 'docs/ops/automation/reconciliation-review.json';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const run = (target, command, ...args) => spawnSync(process.execPath,
  [script, command, '--target', target, ...args], { encoding: 'utf8' });

for (const legacy of [false, true]) test(`reconciliation records reviewed files without bypassing guards (legacy=${legacy})`, async (t) => {
  const target = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'harness-reconcile-')));
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  assert.equal(run(target, 'install').status, 0);
  const packet = await decisions();
  await fs.writeFile(path.join(target, packetRel), JSON.stringify(packet));
  const configured = spawnSync(process.execPath, [path.join(source, 'scripts/bootstrap-configure.mjs'),
    '--target', target, '--decisions', path.join(target, packetRel)], { encoding: 'utf8' });
  assert.equal(configured.status, 0, configured.stderr);
  const custom = '# Reviewed project customization\n';
  await fs.writeFile(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), custom);
  await fs.writeFile(path.join(target, 'unowned.txt'), 'Keep this file.\n');
  const manifestPath = path.join(target, manifestRel);
  const installed = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (legacy) {
    delete installed.decisionsPath;
    for (const entry of installed.managedFiles) {
      delete entry.configuredSha256;
      delete entry.preservedLocal;
    }
  }
  for (const name of ['retired-present.txt', 'retired-missing.txt']) {
    installed.managedFiles.push({ sourcePath: `template/${name}`, targetPath: name, size: 7, sha256: hash('retired') });
  }
  await fs.writeFile(path.join(target, 'retired-present.txt'), 'retired');
  await fs.writeFile(manifestPath, JSON.stringify(installed));
  const before = await fs.readFile(manifestPath, 'utf8');
  const policyBytes = await fs.readFile(path.join(source, policyRel));
  const entries = await collectSourceFiles(JSON.parse(policyBytes));
  const incoming = new Map(entries.map((entry) => [entry.targetPath, entry]));
  const review = {
    version: 1, action: 'record-reconciliation', approvedAt: new Date().toISOString(),
    sourceRevision: spawnSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).stdout.trim(),
    sourceManifestSha256: hash(policyBytes), installedManifestSha256: hash(before),
    decisionsPath: packetRel, decisionsSha256: hash(await fs.readFile(path.join(target, packetRel))), files: []
  };
  for (const targetPath of new Set([...installed.managedFiles.map((entry) => entry.targetPath), ...incoming.keys()])) {
    const entry = incoming.get(targetPath);
    const actual = await fs.readFile(path.join(target, targetPath)).catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    const expected = entry ? hash(configureContent(targetPath,
      await fs.readFile(path.join(source, entry.sourcePath)), packet.values)) : null;
    review.files.push({ targetPath, currentSha256: actual === null ? null : hash(actual),
      sourceSha256: entry?.sha256 ?? null, configuredSha256: expected,
      resolution: entry ? (hash(actual) === expected ? 'configured' : 'preserve-local') : 'retired' });
  }
  const readme = (value) => value.files.find((file) => file.targetPath === 'docs/agent-hardening/RUN_CONTROL.md');
  const changes = [
    (value) => { value.version = 2; },
    (value) => { delete value.approvedAt; },
    (value) => { value.approvedAt = new Date(Date.now() + 86400000).toISOString(); },
    (value) => { value.sourceRevision = '0'.repeat(40); },
    (value) => { value.sourceManifestSha256 = '0'.repeat(64); },
    (value) => { value.installedManifestSha256 = '0'.repeat(64); },
    (value) => { value.decisionsSha256 = '0'.repeat(64); },
    (value) => { value.files.pop(); },
    (value) => { value.files[1] = value.files[0]; },
    (value) => { value.files[0].targetPath = '../outside.txt'; },
    (value) => { readme(value).currentSha256 = '0'.repeat(64); },
    (value) => { readme(value).sourceSha256 = '0'.repeat(64); },
    (value) => { readme(value).configuredSha256 = '0'.repeat(64); },
    (value) => { readme(value).resolution = 'configured'; },
    (value) => { value.files.find((file) => file.targetPath === 'retired-present.txt').resolution = 'configured'; }
  ];
  for (const change of changes) {
    const invalid = structuredClone(review);
    change(invalid);
    await fs.writeFile(path.join(target, reviewRel), JSON.stringify(invalid));
    const result = run(target, 'reconcile', '--review', reviewRel);
    assert.equal(result.status, 1, result.stdout);
    assert.equal(await fs.readFile(manifestPath, 'utf8'), before);
    assert.equal(await fs.readFile(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), 'utf8'), custom);
  }
  await fs.writeFile(path.join(target, reviewRel), JSON.stringify(review));
  await fs.writeFile(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), 'Changed after approval.\n');
  assert.equal(run(target, 'reconcile', '--review', reviewRel).status, 1);
  assert.equal(await fs.readFile(manifestPath, 'utf8'), before);
  await fs.rename(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), path.join(target, 'readme-backup.txt'));
  assert.equal(run(target, 'reconcile', '--review', reviewRel).status, 1);
  await fs.symlink('readme-backup.txt', path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'));
  assert.match(run(target, 'reconcile', '--review', reviewRel).stderr, /SYMLINK/);
  assert.equal(await fs.readFile(manifestPath, 'utf8'), before);
  await fs.unlink(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'));
  await fs.writeFile(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), custom);
  const result = run(target, 'reconcile', '--review', reviewRel);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).filesCopied, 0);
  assert.equal(JSON.parse(result.stdout).filesRemoved, 0);
  const after = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  assert.equal(after.managedFiles.find((entry) => entry.targetPath === 'docs/agent-hardening/RUN_CONTROL.md').preservedLocal, true);
  assert.equal(after.sourceRevision, review.sourceRevision);
  assert.equal(after.reconciliation.reviewSha256, hash(await fs.readFile(path.join(target, reviewRel))));
  assert.equal(after.managedFiles.some((entry) => entry.targetPath.startsWith('retired-')), false);
  assert.equal(await fs.readFile(path.join(target, 'retired-present.txt'), 'utf8'), 'retired');
  assert.equal(await fs.readFile(path.join(target, 'unowned.txt'), 'utf8'), 'Keep this file.\n');
  const finalized = await fs.readFile(manifestPath, 'utf8');
  const guarded = run(target, 'update', '--decisions', path.join(target, packetRel));
  assert.equal(guarded.status, 1);
  assert.match(guarded.stderr, /MODIFIED_MANAGED_FILES/);
  assert.equal(await fs.readFile(manifestPath, 'utf8'), finalized);
  assert.equal(await fs.readFile(path.join(target, 'docs/agent-hardening/RUN_CONTROL.md'), 'utf8'), custom);
});

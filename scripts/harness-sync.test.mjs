import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'harness-sync.mjs');
const bootstrapOnlyPaths = [
  'PLACEHOLDERS.md',
  'package.scripts.fragment.json',
  'scripts/bootstrap-verify.sh',
  'scripts/bootstrap-verify.test.mjs',
  'scripts/check-template-placeholders.mjs',
  'scripts/check-template-placeholders.sh',
  'scripts/check-template-placeholders.test.mjs',
  'scripts/cleanup-bootstrap-artifacts.mjs',
  'scripts/cleanup-bootstrap-artifacts.test.mjs'
];

function run(args, cwd = repoRoot) {
  return spawnSync('node', [scriptPath, ...args], {
    cwd,
    stdio: 'pipe'
  });
}

test('harness-sync install writes target files and downstream manifest', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-install-'));
  const result = run(['install', '--target', targetDir]);
  assert.equal(result.status, 0);

  const readme = await fs.readFile(path.join(targetDir, 'README.md'), 'utf8');
  assert.match(readme, /## Product Scope/);
  assert.match(readme, /## Operating Model/);
  assert.doesNotMatch(readme, /Agent Kickoff Prompts/);

  const manifest = JSON.parse(
    await fs.readFile(path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json'), 'utf8')
  );
  assert.equal(Array.isArray(manifest.managedFiles), true);
  assert.equal(manifest.managedFiles.length > 10, true);
  assert.equal(typeof manifest.sourceRevision, 'string');
  assert.notEqual(manifest.sourceRevision.length, 0);
  assert.equal(manifest.sourceManifest, 'distribution/harness-ownership-manifest.json');
  assert.equal(typeof manifest.sourceManifestSha256, 'string');
  assert.equal(manifest.sourceManifestSha256.length, 64);
  assert.equal(manifest.governedPlaceholders.includes('PRODUCT'), true);
  assert.equal(manifest.governedPlaceholders.includes('EMAIL'), false);
  for (const relative of bootstrapOnlyPaths) {
    assert.equal(manifest.managedFiles.some((entry) => entry.targetPath === relative), false);
    await fs.access(path.join(targetDir, relative));
  }

  const repeated = run(['install', '--target', targetDir]);
  assert.equal(repeated.status, 1);
  assert.match(String(repeated.stderr), /TARGET_ALREADY_INSTALLED.*update or drift/);
});

test('harness-sync install creates nested target directories', async () => {
  const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-nested-'));
  const targetDir = path.join(parentDir, 'missing', 'project');
  const result = run(['install', '--target', targetDir]);
  assert.equal(result.status, 0, String(result.stderr));
  await fs.access(path.join(targetDir, 'AGENTS.md'));
});

test('harness-sync preserves existing project files during adoption', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-adopt-'));
  await fs.writeFile(path.join(targetDir, 'README.md'), '# Existing Project\n', 'utf8');
  await fs.writeFile(path.join(targetDir, 'package.json'), '{"name":"existing"}\n', 'utf8');
  await fs.writeFile(path.join(targetDir, 'npm-shrinkwrap.json'), '{"lockfileVersion":3}\n', 'utf8');

  const drift = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(drift.status, 2);
  assert.equal(JSON.parse(String(drift.stdout)).manifestStatus, 'missing');

  const install = run(['install', '--target', targetDir]);
  assert.equal(install.status, 1);
  assert.match(String(install.stderr), /INSTALL_TARGET_NOT_EMPTY/);
  assert.equal(await fs.readFile(path.join(targetDir, 'README.md'), 'utf8'), '# Existing Project\n');

  const adopt = run(['adopt', '--target', targetDir, '--json', 'true']);
  assert.equal(adopt.status, 0);
  const payload = JSON.parse(String(adopt.stdout));
  assert.equal(payload.preserved.includes('README.md'), true);
  assert.equal(payload.filesCopied > 10, true);
  assert.equal(await fs.readFile(path.join(targetDir, 'README.md'), 'utf8'), '# Existing Project\n');
  await fs.access(path.join(targetDir, 'AGENTS.md'));
  await fs.access(path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json'));
});

test('harness-sync rejects unsupported adoption before copying files', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-unsupported-'));
  await fs.writeFile(path.join(targetDir, 'README.md'), '# Existing Project\n', 'utf8');

  const result = run(['adopt', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /ADOPTION_UNSUPPORTED/);
  assert.deepEqual(await fs.readdir(targetDir), ['README.md']);
});

test('harness-sync rejects bootstrap path collisions before copying files', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-bootstrap-conflict-'));
  await fs.writeFile(path.join(targetDir, 'package.json'), '{"name":"existing"}\n', 'utf8');
  await fs.writeFile(path.join(targetDir, 'yarn.lock'), '# lock\n', 'utf8');
  await fs.writeFile(path.join(targetDir, 'PLACEHOLDERS.md'), '# Existing contract\n', 'utf8');

  const result = run(['adopt', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /BOOTSTRAP_PATH_CONFLICT/);
  assert.deepEqual((await fs.readdir(targetDir)).sort(), ['PLACEHOLDERS.md', 'package.json', 'yarn.lock']);
});

test('harness-sync propagates unreadable target errors before copying files', { skip: process.platform === 'win32' }, async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-unreadable-'));
  const readmePath = path.join(targetDir, 'README.md');
  await fs.writeFile(readmePath, '# Existing\n', { mode: 0o200 });
  const result = run(['install', '--target', targetDir]);
  await fs.chmod(readmePath, 0o600);
  assert.equal(result.status, 1);
  await assert.rejects(fs.access(path.join(targetDir, 'AGENTS.md')));
});

test('harness-sync rejects non-file target collisions before copying files', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-directory-conflict-'));
  await fs.mkdir(path.join(targetDir, 'AGENTS.md'));

  const result = run(['install', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /TARGET_PATH_CONFLICT/);
  assert.deepEqual(await fs.readdir(targetDir), ['AGENTS.md']);
});

test('harness-sync refuses target paths that traverse symbolic links', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-symlink-'));
  const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-outside-'));
  await fs.symlink(outsideDir, path.join(targetDir, 'docs'));
  await fs.writeFile(path.join(targetDir, 'package.json'), '{"name":"existing"}\n', 'utf8');
  await fs.writeFile(path.join(targetDir, 'package-lock.json'), '{"lockfileVersion":3}\n', 'utf8');

  const result = run(['adopt', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /TARGET_SYMLINK/);
  assert.deepEqual((await fs.readdir(targetDir)).sort(), ['docs', 'package-lock.json', 'package.json']);
  assert.deepEqual(await fs.readdir(outsideDir), []);
});

test('harness-sync treats bootstrap helpers as removable after adoption', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-bootstrap-only-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);

  for (const relative of bootstrapOnlyPaths) {
    await fs.rm(path.join(targetDir, relative));
  }

  const result = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 0);
  const payload = JSON.parse(String(result.stdout));
  assert.equal(payload.exact.length, payload.managedFileCount);
  assert.equal(payload.templatePayloadFileCount, payload.managedFileCount + payload.bootstrapOnly.length);
  assert.deepEqual(payload.bootstrapOnly, [...bootstrapOnlyPaths].sort((left, right) => left.localeCompare(right)));
  for (const relative of bootstrapOnlyPaths) {
    assert.equal(payload.missing.includes(relative), false);
  }
});

test('harness-sync drift treats a missing manifest as drift', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-manifest-drift-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);
  await fs.rm(path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json'));

  const result = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 2);
  const payload = JSON.parse(String(result.stdout));
  assert.equal(payload.manifestStatus, 'missing');
  assert.equal(payload.driftDetected, true);
});

test('harness-sync drift reports non-file managed paths as modified JSON', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-path-drift-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);
  await fs.rm(path.join(targetDir, 'AGENTS.md'));
  await fs.mkdir(path.join(targetDir, 'AGENTS.md'));

  const result = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 2, String(result.stderr));
  assert.equal(JSON.parse(String(result.stdout)).modified.includes('AGENTS.md'), true);
});

test('harness-sync drift reports intermediate non-directory paths as modified JSON', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-parent-drift-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);
  await fs.rm(path.join(targetDir, 'docs'), { recursive: true });
  await fs.writeFile(path.join(targetDir, 'docs'), 'occupied\n', 'utf8');

  const result = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 2, String(result.stderr));
  assert.equal(JSON.parse(String(result.stdout)).modified.some((entry) => entry.startsWith('docs/')), true);
});

test('harness-sync drift reports modified managed files', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-drift-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);

  await fs.writeFile(path.join(targetDir, 'README.md'), '# Modified\n', 'utf8');
  const result = run(['drift', '--target', targetDir, '--json', 'true']);

  assert.equal(result.status, 2);
  const payload = JSON.parse(String(result.stdout));
  assert.equal(payload.modified.includes('README.md'), true);
});

test('harness-sync update requires explicit approval to overwrite modified managed files', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-update-'));
  const callerDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-caller-'));

  assert.equal(run(['install', '--target', targetDir], callerDir).status, 0);
  await fs.writeFile(path.join(targetDir, 'README.md'), '# Drifted\n', 'utf8');

  const refused = run(['update', '--target', targetDir], callerDir);
  assert.equal(refused.status, 1);
  assert.match(String(refused.stderr), /MODIFIED_MANAGED_FILES/);
  assert.equal(await fs.readFile(path.join(targetDir, 'README.md'), 'utf8'), '# Drifted\n');

  const result = run(['update', '--target', targetDir, '--overwrite-modified', 'true'], callerDir);
  assert.equal(result.status, 0);

  const readme = await fs.readFile(path.join(targetDir, 'README.md'), 'utf8');
  assert.match(readme, /## Product Scope/);
  assert.match(readme, /## Enforcement and Quality Gates/);
  assert.doesNotMatch(readme, /Agent Kickoff Prompts/);
});

test('harness-sync update accepts files that already match the incoming source', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-incoming-exact-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);
  const manifestPath = path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const readme = manifest.managedFiles.find((entry) => entry.targetPath === 'README.md');
  readme.sha256 = 'previous-revision-hash';
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = run(['update', '--target', targetDir]);
  assert.equal(result.status, 0, String(result.stderr));
});

test('harness-sync update refuses collisions at newly managed paths', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-new-managed-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);
  const targetPath = '.github/PULL_REQUEST_TEMPLATE/fix.md';
  const manifestPath = path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.managedFiles = manifest.managedFiles.filter((entry) => entry.targetPath !== targetPath);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(targetDir, targetPath), '# Existing downstream file\n', 'utf8');

  const result = run(['update', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /MODIFIED_MANAGED_FILES/);
  assert.equal(await fs.readFile(path.join(targetDir, targetPath), 'utf8'), '# Existing downstream file\n');
});

test('harness-sync update refuses targets without an existing downstream harness manifest', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-unmanaged-'));
  await fs.writeFile(path.join(targetDir, 'README.md'), '# Plain Repo\n', 'utf8');

  const result = run(['update', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /\[DOWNSTREAM_MANIFEST_MISSING\]/);

  const readme = await fs.readFile(path.join(targetDir, 'README.md'), 'utf8');
  assert.equal(readme, '# Plain Repo\n');
});

test('harness-sync preserves downstream .gitignore content', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-gitignore-'));
  await fs.writeFile(
    path.join(targetDir, '.gitignore'),
    'node_modules\ncustom-cache\n',
    'utf8'
  );

  const result = run(['install', '--target', targetDir]);
  assert.equal(result.status, 0);

  const gitignore = await fs.readFile(path.join(targetDir, '.gitignore'), 'utf8');
  assert.equal(gitignore, 'node_modules\ncustom-cache\n');

  const manifest = JSON.parse(
    await fs.readFile(path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json'), 'utf8')
  );
  assert.equal(
    manifest.managedFiles.some((entry) => entry.targetPath === '.gitignore'),
    false
  );
});

test('harness-sync drift reports unexpected managed files from the downstream manifest', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-unexpected-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);

  const manifestPath = path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.managedFiles.push({
    targetPath: 'obsolete-managed-file.txt',
    sourcePath: 'template/obsolete-managed-file.txt',
    sha256: 'stale',
    size: 0
  });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = run(['drift', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 2);

  const payload = JSON.parse(String(result.stdout));
  assert.deepEqual(payload.unexpectedManaged, ['obsolete-managed-file.txt']);
});

test('harness-sync update removes managed files no longer present in the source manifest', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-removed-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);

  const removedPath = path.join(targetDir, 'docs', 'obsolete-managed-file.txt');
  await fs.mkdir(path.dirname(removedPath), { recursive: true });
  await fs.writeFile(removedPath, 'stale\n', 'utf8');

  const manifestPath = path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.managedFiles.push({
    targetPath: 'docs/obsolete-managed-file.txt',
    sourcePath: 'template/docs/obsolete-managed-file.txt',
    sha256: createHash('sha256').update('stale\n').digest('hex'),
    size: 6
  });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = run(['update', '--target', targetDir, '--json', 'true']);
  assert.equal(result.status, 0);

  const payload = JSON.parse(String(result.stdout));
  assert.equal(payload.filesRemoved, 1);
  await assert.rejects(fs.access(removedPath));
  assert.equal(run(['drift', '--target', targetDir]).status, 0);
});

test('harness-sync refuses to install over the blueprint repository root', async () => {
  const result = run(['install', '--target', repoRoot]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /Target must be an adopted repository/);
});

test('harness-sync rejects downstream manifest paths that escape the target repo', async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harness-sync-escape-'));
  assert.equal(run(['install', '--target', targetDir]).status, 0);

  const manifestPath = path.join(targetDir, 'docs', 'ops', 'automation', 'harness-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.managedFiles.push({
    targetPath: '../outside.txt',
    sourcePath: 'template/outside.txt',
    sha256: 'stale',
    size: 0
  });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = run(['update', '--target', targetDir]);
  assert.equal(result.status, 1);
  assert.match(String(result.stderr), /repository-relative path/);
});

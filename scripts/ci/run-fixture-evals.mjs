import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { computeEvalInputSha256 } from '../../template/scripts/agent-hardening/eval-input-hash.mjs';

// Fixture-only harness coverage, not a substitute for adopted projects' agent safety evaluations.
export async function runFixtureEvals(repoDir) {
  const initial = spawnSync(process.execPath, ['scripts/agent-hardening/check-evals.mjs'], {
    cwd: repoDir, encoding: 'utf8'
  });
  assert.equal(initial.status, 1, 'A configured template must not start with passing evaluations.');
  assert.match(initial.stderr, /not a completed passing run/);

  const configPath = path.join(repoDir, 'docs/agent-hardening/evals.config.json');
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  config.requiredSuites = [{ id: 'harness-eval-contract', status: 'pass' }];
  config.requiredFailureFixtures = [];
  config.runtime = {
    provider: 'node:test', model: 'not-applicable (harness-only fixture)',
    runtimeVersion: process.version, promptVersion: 'harness-eval-contract-v1',
    toolConfigVersion: 'node-test-v1'
  };
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  const inputSha256 = await computeEvalInputSha256(repoDir, config);
  const tests = [
    'scripts/agent-hardening/check-evals.test.mjs',
    'scripts/agent-hardening/eval-input-hash.test.mjs',
    'scripts/agent-hardening/refresh-evals-report.test.mjs'
  ];
  const result = spawnSync(process.execPath, ['--test', ...tests], {
    cwd: repoDir, encoding: 'utf8', env: { ...process.env, CI: '1' }
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const evidence = 'docs/generated/harness-eval-output.log';
  await fs.writeFile(path.join(repoDir, evidence), result.stdout + result.stderr);
  const generatedAtUtc = new Date().toISOString();
  const report = {
    status: 'pass', generatedAtUtc, inputSha256,
    runtime: { ...config.runtime },
    summary: { total: 1, passed: 1, failed: 0, passRate: 1 },
    regressions: { criticalOpen: 0, highOpen: 0 },
    suites: [{
      id: 'harness-eval-contract', status: 'pass', total: 1, passed: 1, failed: 0,
      execution: {
        runner: `node --test ${tests.join(' ')}`, executedAtUtc: generatedAtUtc,
        inputSha256, fixtureIds: [], evidence
      }
    }],
    evidence: [evidence]
  };
  await fs.writeFile(path.join(repoDir, config.reportPath), `${JSON.stringify(report, null, 2)}\n`);
  console.log('[fixture-evals] recorded passing harness checks; no agent behavior was evaluated.');
}

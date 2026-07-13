import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isHighRiskStandardChangePath,
  summarizePlanCloseoutDiff
} from './plan-closeout-lib.mjs';

test('fix-lane closeout recognizes sensitive paths across workspace roots', () => {
  for (const filePath of [
    'apps/api/src/auth/auth.controller.ts',
    'apps/api/src/persistence/drizzle/schema.ts',
    'apps/api/src/persistence/drizzle/migrations/0020_example.sql',
    'packages/types/src/auth/session.ts',
    'packages/validators/src/tenancy/scope.ts',
    'apps/api/src/billing/credits.service.ts'
  ]) {
    assert.equal(isHighRiskStandardChangePath(filePath), true, filePath);
  }

  const summary = summarizePlanCloseoutDiff(
    ['apps/api/src/auth/auth.controller.ts'],
    { branchName: 'fix/session-boundary' }
  );
  assert.equal(summary.requiresPlanCloseout, true);
  assert.deepEqual(summary.highRiskStandardChangeFiles, ['apps/api/src/auth/auth.controller.ts']);
});

test('fix-lane closeout still permits an isolated low-risk implementation path', () => {
  const summary = summarizePlanCloseoutDiff(
    ['apps/agent-web/components/empty-state.tsx'],
    { branchName: 'fix/empty-state-copy' }
  );
  assert.equal(summary.requiresPlanCloseout, false);
  assert.deepEqual(summary.highRiskStandardChangeFiles, []);
});

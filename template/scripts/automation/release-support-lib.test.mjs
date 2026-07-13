import test from 'node:test';
import assert from 'node:assert/strict';
import { metadataValue } from './release-support-lib.mjs';

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

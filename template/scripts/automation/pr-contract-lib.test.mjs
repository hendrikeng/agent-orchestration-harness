import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePrContract } from './pr-contract-lib.mjs';

const releaseBody = `## Release Contract
- Release ID: 2026.07.13.1
- Release notes generated: \`npm run release:notes\`
- Release completeness verified: \`npm run release:verify\`
- Required release gates passed: Fast Gate / Full Gate / Release Candidate Gate / Browser Smoke / Release Preview
`;

test('release PR contract validates the title before merge', () => {
  assert.deepEqual(validatePrContract({
    headRef: 'release/2026.07.13.1',
    baseRef: 'main',
    title: 'Release 2026.07.13.1',
    body: releaseBody
  }), []);

  assert.match(validatePrContract({
    headRef: 'release/2026.07.13.1',
    baseRef: 'main',
    title: 'Ship it',
    body: releaseBody
  }).join('\n'), /release PR title must be 'Release 2026\.07\.13\.1'/);
});

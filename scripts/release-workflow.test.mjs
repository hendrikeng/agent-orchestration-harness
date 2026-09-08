import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = (name) => readFileSync(new URL(`../template/.github/workflows/${name}.yml`, import.meta.url), 'utf8');

test('default CI validates dev and main without deploying or requiring extra environments', () => {
  const ci = workflow('ci');
  assert.match(ci, /pull_request:\s+branches:\s+- dev\s+- main/);
  assert.match(ci, /push:\s+branches:\s+- dev\s+- main\s+- 'slice\/\*\*'\s+- 'fix\/\*\*'/);
  assert.match(ci, /contains\(fromJSON\('\["dev","main"\]'\), github.base_ref\)/);
  assert.match(ci, /RELEASE_HEAD_REF: \$\{\{ github.event.pull_request.head.sha \}\}/);
  assert.doesNotMatch(ci, /staging|preview|environment:|railway|wrangler/i);
});

test('release tags preserve landed and source identities atomically', () => {
  const tags = workflow('release-tag');
  assert.match(tags, /github.event.pull_request.merged == true/);
  assert.match(tags, /SOURCE_SHA: \$\{\{ github.event.pull_request.head.sha \}\}/);
  assert.match(tags, /git tag -a "\$source_tag" "\$source_sha"/);
  assert.match(tags, /git push --atomic origin "refs\/tags\/\$tag" "refs\/tags\/\$source_tag"/);
  assert.match(tags, /for candidate in "\$tag" "\$source_tag"/);
  assert.match(tags, /date -d/);
  assert.doesNotMatch(tags, /parent_count|must be merged with a merge commit|railway|wrangler/);
});

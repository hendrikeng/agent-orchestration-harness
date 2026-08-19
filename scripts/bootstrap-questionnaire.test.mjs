import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templateDir = path.join(rootDir, 'template');
const questionnairePath = path.join(rootDir, 'distribution', 'bootstrap-questionnaire.json');

async function templatePlaceholders(directory = templateDir) {
  const placeholders = new Set();
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      for (const value of await templatePlaceholders(filePath)) placeholders.add(value);
      continue;
    }
    if (!entry.isFile() || entry.name.endsWith('.test.mjs') || entry.name === 'PLACEHOLDERS.md') continue;
    const content = await fs.readFile(filePath, 'utf8');
    for (const match of content.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)) placeholders.add(match[1]);
  }
  return placeholders;
}

test('bootstrap questionnaire covers every template placeholder exactly once', async () => {
  const questionnaire = JSON.parse(await fs.readFile(questionnairePath, 'utf8'));
  const mapped = questionnaire.sections.flatMap((section) =>
    section.questions.flatMap((question) => question.placeholders)
  );
  const expected = [...await templatePlaceholders()].sort();
  assert.deepEqual([...new Set(mapped)].sort(), expected);
  assert.equal(mapped.length, new Set(mapped).size);
});

#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const PLACEHOLDER_PATTERN = /\{\{[A-Z0-9_]+\}\}/;
const EXCLUDED_DIRECTORIES = new Set(['.git', 'node_modules']);
const EXCLUDED_FILES = new Set(['PLACEHOLDERS.md']);

function toPosix(value) {
  return String(value ?? '').replaceAll(path.sep, '/');
}

async function collectFiles(currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.has(entry.name)) {
        continue;
      }
      files.push(...await collectFiles(path.join(currentDir, entry.name)));
      continue;
    }
    if (entry.isFile() && !EXCLUDED_FILES.has(entry.name)) {
      files.push(path.join(currentDir, entry.name));
    }
  }
  return files.sort((left, right) => left.localeCompare(right));
}

async function findPlaceholders() {
  const files = await collectFiles();
  const hits = [];
  for (const filePath of files) {
    let raw;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }
    if (!raw.includes('{{')) {
      continue;
    }
    const lines = raw.split(/\r?\n/);
    const relPath = toPosix(path.relative(rootDir, filePath));
    for (let index = 0; index < lines.length; index += 1) {
      if (PLACEHOLDER_PATTERN.test(lines[index])) {
        hits.push(`${relPath}:${index + 1}:${lines[index]}`);
      }
    }
  }
  return hits;
}

async function main() {
  const hits = await findPlaceholders();
  if (hits.length > 0) {
    console.log('[placeholder-check] unresolved placeholders found:');
    console.log(hits.join('\n'));
    console.log();
    console.log('[placeholder-check] hint: this is expected on the raw blueprint template.');
    console.log('[placeholder-check] run this after copying the template into a new repo and replacing placeholders.');
    process.exit(1);
  }

  console.log('[placeholder-check] passed (no unresolved placeholders).');
}

main().catch((error) => {
  console.error('[placeholder-check] failed with an unexpected error.');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});

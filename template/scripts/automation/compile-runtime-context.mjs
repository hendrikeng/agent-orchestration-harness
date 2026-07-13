#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveSafeRepoPath } from './lib/repo-paths.mjs';

const DEFAULT_OUTPUT_PATH = 'docs/generated/AGENT-RUNTIME-CONTEXT.md';
const DEFAULT_POLICY_PATH = 'docs/governance/policy-manifest.json';

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    index += 1;
  }
  return options;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function summarizeList(items, prefix = '') {
  return (Array.isArray(items) ? items : [])
    .map((entry) => `- ${prefix}${entry}`)
    .join('\n');
}

function summarizeRules(rules) {
  return (Array.isArray(rules) ? rules : [])
    .map((rule) => `- \`${rule.id}\`: ${rule.statement}`)
    .join('\n');
}

function pick(items, indexes) {
  const source = Array.isArray(items) ? items : [];
  return indexes.map((index) => source[index]).filter(Boolean);
}

function summarizeExecutionQuality(executionQuality) {
  if (!executionQuality) {
    return '';
  }
  return [
    ['goal: ', pick(executionQuality.goalDrivenExecution, [0, 1])],
    ['scope: ', pick(executionQuality.simplicityAndScope, [0])],
    ['assumption: ', pick(executionQuality.assumptionDiscipline, [1])]
  ]
    .map(([prefix, items]) => summarizeList(items, prefix))
    .filter(Boolean)
    .join('\n');
}

function summarizeRunControl(runControl) {
  if (!runControl) {
    return '';
  }
  return [
    ['goal: ', pick(runControl.goalDrivenRunControl, [0, 2, 3])],
    ['delegate: ', pick(runControl.delegationPolicy, [0, 3])],
    ['runtime: ', pick(runControl.runtimeExecutionPolicy, [0, 1, 2, 5])],
    ['audit: ', pick(runControl.completionAudit, [0, 1, 3])]
  ]
    .map(([prefix, items]) => summarizeList(items, prefix))
    .filter(Boolean)
    .join('\n');
}

function isTemplatePlaceholder(value) {
  return /^\{\{[A-Z0-9_]+\}\}$/.test(String(value ?? '').trim());
}

function templatePlaceholder(name) {
  return `{${`{${name}}`}}`;
}

function extractOwner(raw) {
  const owner = String(raw ?? '').match(/^Owner:\s+(.+)$/m)?.[1]?.trim() ?? '';
  return owner && !isTemplatePlaceholder(owner) ? owner : '';
}

function extractLastUpdated(raw) {
  return String(raw ?? '').match(/^Last Updated:\s+(\d{4}-\d{2}-\d{2})$/m)?.[1]?.trim() ?? '';
}

async function readOwnerFromFile(filePath) {
  try {
    return extractOwner(await fs.readFile(filePath, 'utf8'));
  } catch {
    return '';
  }
}

async function resolveDocOwner(rootDir, outputPath) {
  const candidates = [
    path.join(rootDir, 'AGENTS.md'),
    path.join(rootDir, 'README.md'),
    path.join(rootDir, 'docs', 'README.md'),
    outputPath
  ];
  for (const candidate of candidates) {
    const owner = await readOwnerFromFile(candidate);
    if (owner) {
      return owner;
    }
  }
  return templatePlaceholder('DOC_OWNER');
}

async function resolveLastUpdated(rootDir, outputPath) {
  const candidates = [path.join(rootDir, 'AGENTS.md'), path.join(rootDir, 'README.md'), path.join(rootDir, 'docs', 'README.md'), outputPath];
  for (const candidate of candidates) {
    try {
      const value = extractLastUpdated(await fs.readFile(candidate, 'utf8'));
      if (value) return value;
    } catch {
      // Try the next canonical source.
    }
  }
  return templatePlaceholder('LAST_UPDATED_ISO_DATE');
}

function buildContent(policy, today, docOwner) {
  const entryPoints = policy?.docContract?.canonicalEntryPoints ?? [];
  return `# Agent Runtime Context

Status: generated
Owner: ${docOwner}
Last Updated: ${today}
Source of Truth: Derived from AGENTS.md and docs/governance/policy-manifest.json.

## Mission

- Use canonical entrypoints to rebuild context quickly.
- Follow the repo-local queue: \`docs/future/ -> docs/exec-plans/active/ -> docs/exec-plans/completed/\`.
- Treat plans, docs, validation output, change summaries, and evidence as the durable memory system.
- Keep agent-specific instructions subordinate to repo-local canonical docs.

## Execution Model

- mode: ${policy?.executionModel?.mode ?? 'manual-flat-queue'}
${summarizeList(policy?.executionModel?.queue, 'queue: ')}
${summarizeList(policy?.executionModel?.sourceOfTruth, 'source: ')}

Canonical entrypoints:
${entryPoints.map((entry) => `- \`${entry}\``).join('\n')}

## Hard Safety Rules

${summarizeRules(policy?.mandatorySafetyRules)}

## Verification Profiles

- fast: ${(policy?.validationPolicy?.fastIteration ?? []).join(' ; ')}
- full: ${(policy?.validationPolicy?.fullGate ?? []).join(' ; ')}
- repo health: ${(policy?.validationPolicy?.repoHealth ?? []).join(' ; ')}

## Execution Quality

${summarizeExecutionQuality(policy?.executionQuality)}

## Run Control

${summarizeRunControl(policy?.runControl)}

## Memory Posture

${summarizeList(pick(policy?.memoryPosture?.whatToDo, [0, 1, 2, 4]), 'do: ')}
${summarizeList(pick(policy?.memoryPosture?.doNotAddYet, [0, 1]), 'not yet: ')}
- safe rule: ${policy?.memoryPosture?.safeRule ?? 'Keep work state repo-local unless repeated failures prove otherwise.'}

## Execution Checklist

- Read \`AGENTS.md\`, \`README.md\`, the current plan when applicable, and the nearest live code before editing.
- Translate the request into verifiable goals; for multi-step work, pair each step with its check.
- Planning-only work stops in \`docs/future/\`.
- Update canonical docs in the same slice when behavior, workflow, architecture, security, or reliability boundaries change.
- Run the required validation commands and record evidence before closeout.

Generated by \`npm run context:compile\`.
`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const output = resolveSafeRepoPath(rootDir, String(options.output ?? DEFAULT_OUTPUT_PATH), 'Context output path');
  const policy = resolveSafeRepoPath(rootDir, String(options.policy ?? DEFAULT_POLICY_PATH), 'Policy input path');
  const policyJson = await readJson(policy.abs);
  const lastUpdated = await resolveLastUpdated(rootDir, output.abs);
  const docOwner = await resolveDocOwner(rootDir, output.abs);
  const content = buildContent(policyJson, lastUpdated, docOwner);
  await fs.mkdir(path.dirname(output.abs), { recursive: true });
  await fs.writeFile(output.abs, content, 'utf8');
  console.log(`[context:compile] wrote ${output.rel}`);
}

main().catch((error) => {
  console.error('[context:compile] failed.');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});

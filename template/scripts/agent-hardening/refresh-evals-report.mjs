#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveSafeRepoPath } from '../automation/lib/repo-paths.mjs';
import { computeEvalInputSha256, evalInputPaths } from './eval-input-hash.mjs';

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'docs', 'agent-hardening', 'evals.config.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const reportPath = resolveSafeRepoPath(rootDir, config.reportPath, 'Eval report path');
const report = JSON.parse(await fs.readFile(reportPath.abs, 'utf8'));
const inputPaths = evalInputPaths(config);
report.inputSha256 = await computeEvalInputSha256(rootDir, config);
await fs.writeFile(reportPath.abs, `${JSON.stringify(report, null, 2)}\n`);
console.log(`[eval-refresh] wrote ${config.reportPath} from ${inputPaths.length} content-addressed input(s).`);

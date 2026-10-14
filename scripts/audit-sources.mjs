import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { scripts, assets, inspectorFields } from './source-map.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const sourceRootIndex = args.indexOf('--source-root');
if (sourceRootIndex !== -1 && !args[sourceRootIndex + 1]) {
  throw new Error('--source-root requires a Unity project path');
}
const sourceRoot = sourceRootIndex === -1
  ? resolve(root, '../..')
  : resolve(args[sourceRootIndex + 1]);
const snapshotPath = resolve(root, 'content/source-baseline.json');
const write = args.includes('--write');
const entries = [...scripts, ...assets.map((path) => ({ path }))];
const records = [];

for (const entry of entries) {
  let bytes;
  try {
    bytes = await readFile(resolve(sourceRoot, entry.path));
  } catch {
    throw new Error(`Source not found: ${entry.path}. Pass --source-root with the Unity project directory.`);
  }
  const record = { ...entry, sha256: createHash('sha256').update(bytes).digest('hex') };
  if (entry.article) {
    record.fields = inspectorFields(bytes.toString('utf8'));
    const article = await readFile(resolve(root, `src/content/docs/addons/${entry.article}.md`), 'utf8');
    const missing = record.fields.filter((field) => !article.includes('`' + field.name + '`'));
    if (missing.length) {
      throw new Error(`${entry.article}: undocumented Inspector fields: ${missing.map((field) => field.name).join(', ')}`);
    }
  }
  records.push(record);
}

const fieldCount = records.reduce((sum, record) => sum + (record.fields?.length ?? 0), 0);
if (write) {
  await mkdir(resolve(root, 'content'), { recursive: true });
  await writeFile(snapshotPath, JSON.stringify({
    reviewedOn: '2026-10-14',
    scope: 'Source and serialized asset review; no Unity or multi-player runtime verification.',
    files: records,
  }, null, 2) + '\n', 'utf8');
  console.log(`Recorded ${records.length} source fingerprints and ${fieldCount} documented Inspector fields.`);
} else {
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
  const previous = new Map(snapshot.files.map((entry) => [entry.path, entry.sha256]));
  const changed = records.filter((entry) => previous.get(entry.path) !== entry.sha256);
  if (changed.length) {
    throw new Error(`Sources changed; review their articles before refreshing the baseline:\n${changed.map((entry) => entry.path).join('\n')}`);
  }
  console.log(`Source audit passed: ${records.length} fingerprints, ${fieldCount} Inspector fields.`);
}

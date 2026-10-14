import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, sep } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const base = '/AlbusMachinerySaccExtensions-Docs/';
const origin = 'https://ipheion712.github.io';
const decoder = new TextDecoder('utf-8', { fatal: true });
const failures = [];

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)));
}

const pages = (await walk(dist)).filter((file) => file.endsWith('.html'));
const htmlByPath = new Map();
for (const page of pages) htmlByPath.set(page, await readFile(page, 'utf8'));
for (const [page, html] of htmlByPath) {
  const name = relative(dist, page).split(sep).join('/');
  if (!/<html\b[^>]*lang="ja"/.test(html)) failures.push(`${name}: Japanese lang attribute missing`);
  const pageUrl = new URL(base + name.replace(/index\.html$/, ''), origin);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = decodeEntities(match[1]);
    if (!raw || /^(?:data:|mailto:|tel:|javascript:)/i.test(raw)) continue;
    let url;
    try { url = new URL(raw, pageUrl); } catch { failures.push(`${name}: invalid URL ${raw}`); continue; }
    if (url.origin !== origin) continue;
    if (!url.pathname.startsWith(base)) {
      failures.push(`${name}: URL bypasses GitHub Pages base: ${raw}`);
      continue;
    }
    const local = decodeURIComponent(url.pathname.slice(base.length));
    const targetPath = resolve(dist, local);
    if (targetPath !== dist && !targetPath.startsWith(dist + sep)) {
      failures.push(`${name}: URL escapes dist: ${raw}`);
      continue;
    }
    let target;
    try {
      const info = await stat(targetPath);
      target = info.isDirectory() ? resolve(targetPath, 'index.html') : targetPath;
      await stat(target);
    } catch { failures.push(`${name}: target missing: ${raw}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      const targetHtml = htmlByPath.get(target) ?? await readFile(target, 'utf8');
      const ids = new Set([...targetHtml.matchAll(/\bid="([^"]+)"/g)].map((item) => decodeEntities(item[1])));
      const hash = decodeURIComponent(url.hash.slice(1));
      if (!ids.has(hash)) failures.push(`${name}: anchor missing: ${raw}`);
    }
  }
}

for (const dir of ['src', 'scripts', 'content', '.github']) {
  for (const file of await walk(resolve(root, dir))) {
    const bytes = await readFile(file);
    let text;
    try { text = decoder.decode(bytes); } catch { failures.push(`${relative(root, file)}: invalid UTF-8`); continue; }
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) failures.push(`${relative(root, file)}: UTF-8 BOM`);
    if (text.includes('\ufffd') || /\?\?\?/.test(text)) failures.push(`${relative(root, file)}: possible encoding corruption`);
  }
}

const snapshot = JSON.parse(await readFile(resolve(root, 'content/source-baseline.json'), 'utf8'));
let fields = 0;
for (const entry of snapshot.files.filter((entry) => entry.article)) {
  const article = await readFile(resolve(root, `src/content/docs/addons/${entry.article}.md`), 'utf8');
  for (const field of entry.fields) {
    fields++;
    if (!article.includes('`' + field.name + '`')) failures.push(`${entry.article}: field missing: ${field.name}`);
  }
}

for (const path of ['pagefind/pagefind.js', 'addons/index.html', 'getting-started/installation/index.html']) {
  try { await stat(resolve(dist, path)); } catch { failures.push(`Required output missing: ${path}`); }
}
const addonPages = pages.filter((page) => relative(dist, page).replaceAll(sep, '/').match(/^addons\/[^/]+\/index\.html$/));
if (addonPages.length !== 10) failures.push(`Expected 10 addon pages, found ${addonPages.length}`);
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Site verification passed: ${pages.length} HTML pages, 10 addon articles, ${fields} Inspector fields, links/anchors/assets, Japanese HTML, UTF-8 and search output.`);
}

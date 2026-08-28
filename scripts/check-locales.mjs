import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();
const englishRoot = join(root, 'content', 'en');
const japaneseRoot = join(root, 'content', 'ja');

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path, base) : [relative(base, path)];
  }));
  return files.flat().sort();
}

const [englishFiles, japaneseFiles] = await Promise.all([
  listFiles(englishRoot),
  listFiles(japaneseRoot),
]);

const failures = [];
if (JSON.stringify(englishFiles) !== JSON.stringify(japaneseFiles)) {
  const englishSet = new Set(englishFiles);
  const japaneseSet = new Set(japaneseFiles);
  failures.push(`Missing Japanese files: ${englishFiles.filter(file => !japaneseSet.has(file)).join(', ') || 'none'}`);
  failures.push(`Unexpected Japanese files: ${japaneseFiles.filter(file => !englishSet.has(file)).join(', ') || 'none'}`);
}

const forbidden = /ZXQ(?:TRANS|PROTECT|SEG)|ZZQ|〔V\d{4}〕|\/en\//;
for (const file of japaneseFiles) {
  const content = await readFile(join(japaneseRoot, file), 'utf8');
  if (forbidden.test(content)) failures.push(`${file}: contains an unresolved translation token or English locale link`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Japanese locale is structurally complete (${japaneseFiles.length} files).`);

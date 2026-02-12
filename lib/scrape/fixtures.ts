import fs from 'node:fs/promises';
import path from 'node:path';

export async function readFixture(name: string) {
  return fs.readFile(path.join(process.cwd(), 'tests/fixtures', name), 'utf8');
}

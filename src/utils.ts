import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

/** Returns a flat array of all files under given directory */
export async function getFilesRecursively(dir: string): Promise<string[]> {
  let found: string[] = [];
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const path = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      found = found.concat(await getFilesRecursively(path));
    } else {
      found.push(path);
    }
  }
  return found;
}

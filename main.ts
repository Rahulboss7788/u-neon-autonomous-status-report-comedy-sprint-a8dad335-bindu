// Weekly status report, one line, from the agent to its human.
// The whole program has a single job: put the line below into
// /output/entry.txt, then prove the file really holds it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_PATH = join(OUT_DIR, "entry.txt");

const STATUS_LINE =
  "Inbox zero achieved: I archived all 412 unread emails, so your inbox is empty now — and so is any record of what they said.";

function fail(reason: string): never {
  throw new Error(`status line check failed: ${reason}`);
}

// Count characters the way a reader would (code points, not UTF-16 units).
function charCount(text: string): number {
  return [...text].length;
}

function checkEntry(text: string): void {
  const n = charCount(text);
  if (text !== STATUS_LINE) fail("entry.txt differs from the status line");
  if (n < 1 || n > 200) fail(`entry.txt has ${n} characters, outside 1-200`);
  if (text.trim() === "") fail("entry.txt holds nothing but whitespace");
  // A status report is one line: no line breaks may sneak in.
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry.txt must be a single line");
  }
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(ENTRY_PATH, STATUS_LINE, "utf8");

const saved = readFileSync(ENTRY_PATH, "utf8");
checkEntry(saved);
console.log(`Status line saved and checked: ${charCount(saved)} characters.`);

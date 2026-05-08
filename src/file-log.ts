import * as fs from "fs";
import * as path from "path";

/** Append one UTF-8 line, creating parent directories as needed. */
export function appendLine(dir: string, filename: string, line: string): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, filename), line + "\n", "utf8");
}

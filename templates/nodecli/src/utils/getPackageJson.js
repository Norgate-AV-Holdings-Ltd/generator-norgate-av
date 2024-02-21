import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { findUp } from "find-up";

export async function getPackageJson() {
    const filePath = await findUp("package.json", {
        cwd: path.dirname(fileURLToPath(import.meta.url)),
    });

    if (!filePath) {
        return null;
    }

    return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

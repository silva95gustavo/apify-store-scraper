import path from "path";
import fs from "fs/promises";
import { mkdtempSync, rmSync, existsSync } from "fs";
import os from "os";
import { spawn } from "child_process";
import { DatasetItem } from "../../src/types";

// Root directory of the project
const PROJECT_ROOT = process.cwd();

// Function to run the Apify actor locally with given input
// Returns the dataset items and logs from the run
export async function runActorWithInput(
    input: unknown
): Promise<{ datasetItems: DatasetItem[]; logs: string }> {
    // Create a temporary directory for local storage
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), "actor-snap-"));
    try {
        // Set up directories for key-value store and datasets
        const kvStoreDir = path.join(tmpDir, "key_value_stores", "default");
        const datasetsDir = path.join(tmpDir, "datasets", "default");

        await fs.mkdir(kvStoreDir, { recursive: true });
        await fs.mkdir(datasetsDir, { recursive: true });

        // Write the input to the key-value store as INPUT.json
        await fs.writeFile(
            path.join(kvStoreDir, "INPUT.json"),
            JSON.stringify(input, null, 2)
        );

        // Command to run the actor locally
        const processArgs = ["run"];

        // Environment variables for the actor run
        const env: NodeJS.ProcessEnv = {
            ...process.env,
            APIFY_LOCAL_STORAGE_DIR: tmpDir,
            APIFY_TOKEN: process.env.APIFY_API_TOKEN,
        };

        let logs = "";

        // Run the actor using 'apify run' and capture logs
        await new Promise<void>((resolve, reject) => {
            const child = spawn("apify", processArgs, {
                cwd: PROJECT_ROOT,
                env,
                stdio: ["ignore", "pipe", "pipe"],
            });

            child.stdout.on("data", (d: Buffer) => {
                logs += d.toString();
            });
            child.stderr.on("data", (d: Buffer) => {
                logs += d.toString();
            });
            child.on("error", reject);
            child.on("close", (code) => {
                if (code === 0) resolve();
                else
                    reject(
                        new Error(`Actor exited with code ${code}\n${logs}`)
                    );
            });
        });

        // Read the dataset items from the local storage
        const items: DatasetItem[] = [];
        if (existsSync(datasetsDir)) {
            const files = await fs.readdir(datasetsDir);
            const jsonFiles = files.filter((f) => f.endsWith(".json"));
            for (const f of jsonFiles) {
                const raw = await fs.readFile(
                    path.join(datasetsDir, f),
                    "utf-8"
                );
                items.push(JSON.parse(raw));
            }
        }
        return { datasetItems: items, logs };
    } finally {
        // Clean up temporary directory
        rmSync(tmpDir, { recursive: true, force: true });
    }
}

import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
// @ts-ignore - Assuming adm-zip is installed: npm install adm-zip
import AdmZip from "adm-zip";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const execAsync = util.promisify(exec);

export class RestoreService {
    private readonly TEMP_DIR = "/tmp/elsalam_restore";
    private readonly DB_URL = process.env.DATABASE_URL!;
    private readonly UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

    constructor() {
        if (!fs.existsSync(this.TEMP_DIR)) {
            fs.mkdirSync(this.TEMP_DIR, { recursive: true });
        }
    }

    /**
     * Restores the system from a given zip file path.
     * DANGEROUS: Overwrites current DB and Uploads!
     */
    async restoreBackup(zipPath: string): Promise<boolean> {
        const extractDir = path.join(this.TEMP_DIR, `extracted_${Date.now()}`);
        
        try {
            logger.warn({ message: "[RESTORE] Starting critical restore process...", zipPath });
            fs.mkdirSync(extractDir, { recursive: true });

            // 1. Extract Archive Safely (Prevent Zip Slip Vulnerability)
            const zip = new AdmZip(zipPath);
            const zipEntries = zip.getEntries();
            for (const entry of zipEntries) {
                // Prevent path traversal attacks like ../../../etc/passwd
                if (entry.entryName.includes("..") || entry.entryName.startsWith("/")) {
                    throw new Error("Security Error: Malicious zip file detected (Zip Slip).");
                }
            }
            zip.extractAllTo(extractDir, true);

            // 2. Restore Database (Atomic & Shell Safe)
            const dbDumpPath = path.join(extractDir, "database.sql");
            if (fs.existsSync(dbDumpPath)) {
                logger.warn({ message: "[RESTORE] Restoring database via psql..." });
                
                await prisma.$disconnect();

                try {
                    // CRITICAL FIX: Shell Injection Prevention + Atomic Restore
                    // Using execFile bypasses the shell, avoiding injection if DB_URL contains meta-characters.
                    // --single-transaction ensures if it fails halfway, it rolls back fully (Consistency).
                    const { execFile } = require("child_process");
                    const execFileAsync = util.promisify(execFile);
                    
                    await execFileAsync("psql", ["--single-transaction", "-f", dbDumpPath, this.DB_URL]);
                    logger.info({ message: "[RESTORE] Database restored atomically." });
                } catch (dbError: any) {
                    // SECURE: Hide DATABASE_URL from logs if exec fails
                    const safeMessage = dbError.message.replace(this.DB_URL, "***HIDDEN_DB_URL***");
                    throw new Error(`DB Restore Failed: ${safeMessage}`);
                } finally {
                    // CRITICAL FIX: Ensure Prisma reconnects even if restore fails
                    await prisma.$connect();
                }
            } else {
                throw new Error("database.sql not found in backup archive.");
            }

            // 3. Restore Uploads
            const extractedUploadsDir = path.join(extractDir, "uploads");
            if (fs.existsSync(extractedUploadsDir)) {
                logger.info({ message: "[RESTORE] Restoring uploads folder..." });
                // Clean existing uploads safely
                if (fs.existsSync(this.UPLOADS_DIR)) {
                    fs.rmSync(this.UPLOADS_DIR, { recursive: true, force: true });
                }
                // Move extracted uploads to public/uploads
                fs.renameSync(extractedUploadsDir, this.UPLOADS_DIR);
            }

            // Cleanup
            fs.rmSync(extractDir, { recursive: true, force: true });
            fs.rmSync(zipPath, { force: true }); // Delete the uploaded zip

            logger.info({ message: "[RESTORE] Restore completed successfully." });
            return true;

        } catch (error: any) {
            logger.error({ message: "[RESTORE] Critical failure during restore", errorStack: error.stack });
            throw new Error(`Restore failed: ${error.message}`);
        }
    }
}

export const restoreService = new RestoreService();

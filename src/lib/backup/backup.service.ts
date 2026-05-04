import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { logger } from "@/lib/logger";

const execAsync = util.promisify(exec);

export class BackupService {
    private readonly TEMP_DIR = "/tmp/elsalam_backups";
    private readonly DB_URL = process.env.DATABASE_URL!;
    private readonly UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

    constructor() {
        if (!fs.existsSync(this.TEMP_DIR)) {
            fs.mkdirSync(this.TEMP_DIR, { recursive: true });
        } else {
            // CRITICAL FIX: Purge Zombie Backups from Fatal Process Crashes (SIGTERM/OOM)
            try {
                const files = fs.readdirSync(this.TEMP_DIR);
                const now = Date.now();
                for (const file of files) {
                    const filePath = path.join(this.TEMP_DIR, file);
                    const stat = fs.statSync(filePath);
                    // Delete files older than 1 hour
                    if (now - stat.mtimeMs > 3600000) {
                        fs.rmSync(filePath, { recursive: true, force: true });
                    }
                }
            } catch (e) { /* ignore */ }
        }
    }

    /**
     * Creates a full system backup (DB + Uploads) and returns the zip file path.
     */
    async createBackup(): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupName = `backup_${timestamp}`;
        const backupDir = path.join(this.TEMP_DIR, backupName);
        const zipPath = path.join(this.TEMP_DIR, `${backupName}.zip`);

        try {
            fs.mkdirSync(backupDir, { recursive: true });

            // 1. Dump Database
            const dbDumpPath = path.join(backupDir, "database.sql");
            logger.info({ message: "[BACKUP] Starting database dump..." });
            
            try {
                // CRITICAL FIX: Shell Injection Prevention
                // Using execFile bypasses the shell, avoiding injection if DB_URL contains meta-characters.
                const { execFile } = require("child_process");
                const execFileAsync = util.promisify(execFile);
                
                await execFileAsync("pg_dump", [this.DB_URL, "-f", dbDumpPath, "--clean", "--if-exists"]);
            } catch (dbError: any) {
                // SECURE: Hide DATABASE_URL from logs if exec fails
                const safeMessage = dbError.message.replace(this.DB_URL, "***HIDDEN_DB_URL***");
                throw new Error(`pg_dump failed: ${safeMessage}`);
            }
            
            // 2. Create Zip Archive
            logger.info({ message: "[BACKUP] Creating zip archive..." });
            await this.archiveFiles(backupDir, this.UPLOADS_DIR, zipPath);

            // Cleanup temp folder (keep the zip)
            fs.rmSync(backupDir, { recursive: true, force: true });
            
            logger.info({ message: "[BACKUP] Backup created successfully", zipPath });
            return zipPath;

        } catch (error: any) {
            // CRITICAL FIX: Delete partial/corrupted files if process fails during slow Disk IO
            try {
                if (fs.existsSync(backupDir)) fs.rmSync(backupDir, { recursive: true, force: true });
                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
            } catch (cleanupError) { /* ignore */ }
            
            logger.error({ message: "[BACKUP] Failed to create backup", errorStack: error.stack });
            throw new Error(`Backup failed: ${error.message}`);
        }
    }

    private archiveFiles(dbDir: string, uploadsDir: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve());
            archive.on('error', (err: any) => reject(err));

            archive.pipe(output);

            // Append DB dump
            archive.directory(dbDir, false);

            // Append Uploads directory if it exists
            if (fs.existsSync(uploadsDir)) {
                archive.directory(uploadsDir, 'uploads');
            }

            archive.finalize();
        });
    }
}

export const backupService = new BackupService();

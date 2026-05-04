import { google } from "googleapis";
import fs from "fs";
import { logger } from "@/lib/logger";

export class GoogleDriveService {
    private drive: any;
    private readonly FOLDER_ID = process.env.GOOGLE_DRIVE_BACKUP_FOLDER_ID;

    constructor() {
        try {
            // Assumes Google Service Account credentials are provided as a JSON string in ENV
            // e.g., GOOGLE_SERVICE_ACCOUNT_JSON='{"client_email": "...", "private_key": "..."}'
            if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
                const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
                const auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ["https://www.googleapis.com/auth/drive.file"],
                });
                this.drive = google.drive({ version: "v3", auth });
            }
        } catch (error: any) {
            logger.warn({ message: "[DRIVE] Failed to initialize Google Drive client", error: error.message });
        }
    }

    /**
     * Uploads a file to Google Drive and returns the webViewLink.
     */
    async uploadBackup(filePath: string, fileName: string): Promise<string> {
        if (!this.drive) throw new Error("Google Drive is not configured.");

        try {
            logger.info({ message: "[DRIVE] Uploading backup to Google Drive...", fileName });

            const fileMetadata = {
                name: fileName,
                parents: this.FOLDER_ID ? [this.FOLDER_ID] : [],
            };
            
            const media = {
                mimeType: "application/zip",
                body: fs.createReadStream(filePath),
            };

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id, webViewLink",
            });

            logger.info({ message: "[DRIVE] Upload successful", link: response.data.webViewLink });
            
            // Delete local file after upload to save space
            fs.rmSync(filePath, { force: true });

            return response.data.webViewLink;
        } catch (error: any) {
            logger.error({ message: "[DRIVE] Upload failed", errorStack: error.stack });
            throw new Error(`Failed to upload to Google Drive: ${error.message}`);
        }
    }
}

export const googleDriveService = new GoogleDriveService();

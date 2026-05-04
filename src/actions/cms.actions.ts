"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Saves CMS content while automatically archiving the old version.
 * Uses Prisma Transactions to guarantee atomicity and data integrity.
 */
export async function savePageContent(pageSlug: string, newContent: string, label: string = "Auto-save") {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Using $transaction ensures that if the new content fails to save, the history isn't created, and vice versa.
        await prisma.$transaction(async (tx) => {
            // 1. Fetch current content (if exists) to archive it
            const currentContent = await tx.pageContent.findUnique({
                where: { pageSlug }
            });

            if (currentContent && currentContent.content !== newContent) {
                // 2. Archive the OLD content into History before overwriting
                await tx.pageContentHistory.create({
                    data: {
                        pageSlug: currentContent.pageSlug,
                        content: currentContent.content,
                        label: label,
                    }
                });
            }

            // 3. Upsert the NEW content
            await tx.pageContent.upsert({
                where: { pageSlug },
                update: { content: newContent },
                create: { pageSlug, content: newContent }
            });
            
            // 4. Cleanup old histories to prevent Database bloat (Keep last 20 versions per page)
            const oldVersions = await tx.pageContentHistory.findMany({
                where: { pageSlug },
                orderBy: { savedAt: 'desc' },
                skip: 20, // Skip the 20 most recent
            });
            
            if (oldVersions.length > 0) {
                const idsToDelete = oldVersions.map(v => v.id);
                await tx.pageContentHistory.deleteMany({
                    where: { id: { in: idsToDelete } }
                });
            }
        });

        return { success: true, message: "Page saved and version archived successfully." };
    } catch (error: any) {
        console.error("[CMS_SAVE_ERROR]", error);
        return { success: false, error: "Failed to save page content." };
    }
}

/**
 * Restores a specific historical snapshot into the live CMS.
 */
export async function rollbackPageContent(historyId: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Find the target history snapshot
            const snapshot = await tx.pageContentHistory.findUnique({
                where: { id: historyId }
            });

            if (!snapshot) {
                throw new Error("Snapshot not found.");
            }

            // 2. Fetch the current live content before overwriting to save it as "Pre-rollback state"
            const currentLive = await tx.pageContent.findUnique({
                where: { pageSlug: snapshot.pageSlug }
            });

            if (currentLive) {
                await tx.pageContentHistory.create({
                    data: {
                        pageSlug: currentLive.pageSlug,
                        content: currentLive.content,
                        label: "Auto-save before rollback",
                    }
                });
            }

            // 3. Restore the snapshot into the live table
            await tx.pageContent.upsert({
                where: { pageSlug: snapshot.pageSlug },
                update: { content: snapshot.content },
                create: { pageSlug: snapshot.pageSlug, content: snapshot.content }
            });
        });

        return { success: true, message: "Page rolled back successfully." };
    } catch (error: any) {
        console.error("[CMS_ROLLBACK_ERROR]", error);
        return { success: false, error: error.message || "Failed to rollback page content." };
    }
}

/**
 * Retrieves a lightweight list of history versions for a page.
 */
export async function getPageHistory(pageSlug: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const history = await prisma.pageContentHistory.findMany({
            where: { pageSlug },
            orderBy: { savedAt: "desc" },
            // Explicitly exclude the 'content' string itself to save bandwidth
            select: { id: true, savedAt: true, label: true } 
        });

        return { success: true, history };
    } catch (error: any) {
        console.error("[CMS_HISTORY_ERROR]", error);
        return { success: false, error: "Failed to load page history." };
    }
}

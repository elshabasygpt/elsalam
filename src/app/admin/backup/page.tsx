"use client";

import { useState } from "react";

export default function BackupAdminPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleDownload = () => {
        window.location.href = "/api/admin/backup/download";
    };

    const handleUploadDrive = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/admin/backup/upload-drive", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Success! Google Drive Link: ${data.link}`);
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error: any) {
            setMessage(`Failed to upload: ${error.message}`);
        }
        setLoading(false);
    };

    const handleRestore = async () => {
        if (!file) return alert("Please select a backup file first.");
        
        const confirmRestore = confirm("CRITICAL WARNING: This will overwrite your current database and uploads. Type 'RESTORE' to confirm.");
        if (!confirmRestore) return;
        
        // Simple double verification
        const secondConfirm = prompt("Type 'RESTORE' to proceed:");
        if (secondConfirm !== "RESTORE") return;

        setLoading(true);
        setMessage("Restoring... Please do not close this page.");
        
        const formData = new FormData();
        formData.append("backup", file);
        formData.append("confirm", "true");

        try {
            const res = await fetch("/api/admin/backup/restore", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Restore completed successfully! The system is back online.");
            } else {
                setMessage(`Restore failed: ${data.error}`);
            }
        } catch (error: any) {
            setMessage(`Restore request failed: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">System Backup & Restore</h1>
            <p className="text-gray-600">
                Manage full system backups including database and uploaded media files. 
                Keep backups in a safe place.
            </p>

            {message && (
                <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-md">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Backup Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold">Create Backup</h2>
                    <p className="text-sm text-gray-500">Download a .zip file or send it to Google Drive.</p>
                    
                    <div className="flex flex-col space-y-3">
                        <button 
                            onClick={handleDownload}
                            disabled={loading}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                        >
                            Download Backup (.zip)
                        </button>
                        
                        <button 
                            onClick={handleUploadDrive}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                        >
                            {loading ? "Processing..." : "Upload to Google Drive"}
                        </button>
                    </div>
                </div>

                {/* Restore Section */}
                <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 space-y-4">
                    <h2 className="text-xl font-semibold text-red-700">Restore System</h2>
                    <p className="text-sm text-red-600">
                        Warning: Restoring will overwrite all current data.
                    </p>
                    
                    <div className="space-y-3">
                        <input 
                            type="file" 
                            accept=".zip"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                        />
                        <button 
                            onClick={handleRestore}
                            disabled={loading || !file}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition disabled:opacity-50"
                        >
                            {loading ? "Restoring..." : "Restore Backup"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

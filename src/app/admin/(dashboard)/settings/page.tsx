import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                siteNameAr: "مصنع السلام للزيوت النباتية",
                siteNameEn: "Elsalam Vegetable Oils Factory",
                contactEmail: "info@elsalamoils.com",
                contactPhone: "+20 123 456 7890",
            },
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">إعدادات الموقع</h1>
                <p className="text-slate-400 text-sm mt-1">تعديل المعلومات الأساسية وبيانات التواصل</p>
            </div>
            <SettingsForm
                initialData={{
                    id: settings.id,
                    siteNameAr: settings.siteNameAr || "",
                    siteNameEn: settings.siteNameEn || "",
                    siteDescriptionAr: settings.siteDescriptionAr || "",
                    siteDescriptionEn: settings.siteDescriptionEn || "",
                    contactEmail: settings.contactEmail || "",
                    contactPhone: settings.contactPhone || "",
                    addressAr: settings.addressAr || "",
                    addressEn: settings.addressEn || "",
                    facebookUrl: settings.facebookUrl || "",
                    twitterUrl: settings.twitterUrl || "",
                    instagramUrl: settings.instagramUrl || "",
                    linkedinUrl: settings.linkedinUrl || "",
                    smtpHost: (settings as any).smtpHost || "",
                    smtpPort: (settings as any).smtpPort || 587,
                    smtpUser: (settings as any).smtpUser || "",
                    smtpPass: (settings as any).smtpPass || "",
                    smtpFrom: (settings as any).smtpFrom || "",
                    smtpFromName: (settings as any).smtpFromName || "",
                    smtpSecure: (settings as any).smtpSecure || "tls",
                    logoUrl: (settings as any).logoUrl || "",
                    googleAnalyticsId: (settings as any).googleAnalyticsId || "",
                    imapHost: (settings as any).imapHost || "",
                    imapPort: (settings as any).imapPort || 993,
                    imapSecure: (settings as any).imapSecure || "tls",
                    imapUser: (settings as any).imapUser || "",
                    imapPass: (settings as any).imapPass || "",
                }}
            />
        </div>
    );
}

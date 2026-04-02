import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "تواصل معنا | مصنع السلام للزيوت النباتية",
    description: "تواصل مع مصنع السلام للزيوت النباتية — استفسارات، طلبات تسعير، شراكات تصدير. فريقنا جاهز لمساعدتك خلال 24 ساعة عمل.",
    openGraph: {
        title: "تواصل معنا | مصنع السلام",
        description: "نسعد بالرد على استفساراتكم حول منتجاتنا وخدمات التصدير.",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}

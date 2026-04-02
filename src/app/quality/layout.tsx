import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "معايير الجودة | مصنع السلام للزيوت النباتية",
    description: "نلتزم بأعلى معايير الجودة والسلامة الغذائية — شهادات ISO 9001، ISO 22000، HACCP، وحلال. 8 نقاط فحص صارمة في كل دورة إنتاج.",
    openGraph: {
        title: "معايير الجودة | مصنع السلام",
        description: "شهادات ISO 9001 و ISO 22000 و HACCP — جودة عالمية في كل مرحلة إنتاج.",
    },
};

export default function QualityLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "مراحل الإنتاج | مصنع السلام للزيوت النباتية",
    description: "تعرف على 8 مراحل إنتاج الزيوت النباتية في مصنع السلام — من استلام البذور وحتى التعبئة والتغليف بأعلى معايير الجودة والسلامة الغذائية.",
    openGraph: {
        title: "مراحل الإنتاج | مصنع السلام",
        description: "من البذور الخام إلى المنتج النهائي — 8 مراحل إنتاج بأعلى معايير الجودة.",
    },
};

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "من نحن | مصنع السلام للزيوت النباتية",
    description: "تعرف على قصة مصنع السلام لعصر واستخلاص الزيوت النباتية — أكثر من 25 عاماً من الريادة، 8 خطوط إنتاج، وطاقة 500 طن يومياً.",
    openGraph: {
        title: "من نحن | مصنع السلام",
        description: "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج.",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "المركز الإعلامي | مصنع السلام للزيوت النباتية",
    description: "اكتشف مصنع السلام من الداخل — جولات داخل المصنع، لقاءات تلفزيونية، معارض دولية، ومعرض المنتجات.",
    openGraph: {
        title: "المركز الإعلامي | مصنع السلام",
        description: "أحدث الأخبار والفيديوهات من مصنع السلام للزيوت النباتية.",
    },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
    return children;
}

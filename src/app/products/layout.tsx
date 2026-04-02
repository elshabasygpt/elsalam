import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "منتجاتنا | مصنع السلام للزيوت النباتية",
    description: "تشكيلة كاملة من الزيوت النباتية المكررة، السمن النباتي، والشورتنج الصناعي بأعلى معايير الجودة. منتجات جاهزة للتصدير.",
    openGraph: {
        title: "منتجاتنا | مصنع السلام",
        description: "زيوت نباتية، سمن، وشورتنج بجودة عالمية للسوق المحلي والتصدير.",
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return children;
}

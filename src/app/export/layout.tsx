import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Export | Elsalam Vegetable Oils",
    description: "Premium quality vegetable oils, margarine & shortening from Egypt. ISO & Halal certified, shipped to 15+ countries worldwide. FOB Alexandria, CIF, DDP available.",
    openGraph: {
        title: "Export | Elsalam Vegetable Oils",
        description: "Export-ready vegetable oils from Egypt — ISO & Halal certified, shipped to 15+ countries.",
    },
};

export default function ExportLayout({ children }: { children: React.ReactNode }) {
    return children;
}

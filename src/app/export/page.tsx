import { Metadata } from 'next';
import { ExportClient } from './export-client';

export const metadata: Metadata = {
    title: 'تصدير حول العالم | مصنع السلام للزيوت النباتية',
    description: 'نفخر بتصدير منتجاتنا لأكثر من ١٥ دولة حول العالم بأعلى معايير الشحن والمطابقة.',
};

export default function ExportPage() {
    return <ExportClient />;
}

import { Metadata } from 'next';
import { ProductsClient } from './products-client';

export const metadata: Metadata = {
    title: 'منتجاتنا | مصنع السلام للزيوت النباتية',
    description: 'تصفح قائمة منتجاتنا من زيوت الطعام، السمن النباتي، والشورتنج المصنعة بأعلى معايير الجودة العالمية.',
};

import { Suspense } from 'react';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-surface-soft flex items-center justify-center p-24 text-green-700">جاري التحميل...</div>}>
            <ProductsClient />
        </Suspense>
    );
}

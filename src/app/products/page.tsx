import { Metadata } from 'next';
import { ProductsClient } from './products-client';

export const metadata: Metadata = {
    title: 'منتجاتنا | مصنع السلام للزيوت النباتية',
    description: 'تصفح قائمة منتجاتنا من زيوت الطعام، السمن النباتي، والشورتنج المصنعة بأعلى معايير الجودة العالمية.',
};

export default function ProductsPage() {
    return <ProductsClient />;
}

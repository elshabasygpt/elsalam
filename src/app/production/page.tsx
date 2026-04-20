import { Metadata } from 'next';
import { ProductionClient } from './production-client';

export const metadata: Metadata = {
    title: 'قدراتنا الإنتاجية | مصنع السلام للزيوت النباتية',
    description: 'خطوط إنتاج متطورة وتقنيات تصنيع حديثة لتلبية احتياجات السوق المحلي والعالمي.',
};

export default function ProductionPage() {
    return <ProductionClient />;
}

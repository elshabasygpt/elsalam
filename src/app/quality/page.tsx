import { Metadata } from 'next';
import { QualityClient } from './quality-client';

export const metadata: Metadata = {
    title: 'نظام الجودة | مصنع السلام للزيوت النباتية',
    description: 'تعرف على معايير الجودة العالمية التي نطبقها في كل قطرة من منتجاتنا في مصنع السلام.',
};

export default function QualityPage() {
    return <QualityClient />;
}

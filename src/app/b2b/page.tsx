import { Metadata } from 'next';
import { B2BClient } from './b2b-client';

export const metadata: Metadata = {
    title: 'شراكات B2B والمصانع | مصنع السلام للزيوت النباتية',
    description: 'نوفر حلولاً متكاملة وتوريدات الجملة لشركائنا من المصانع وشركات الأغذية.',
};

export default function B2BPage() {
    return <B2BClient />;
}

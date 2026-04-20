import { Metadata } from 'next';
import { MediaClient } from './media-client';

export const metadata: Metadata = {
    title: 'المركز الإعلامي | مصنع السلام للزيوت النباتية',
    description: 'تابع أحدث الأخبار، التغطيات، والمعارض الخاصة بمصنع السلام للزيوت النباتية.',
};

export default function MediaPage() {
    return <MediaClient />;
}

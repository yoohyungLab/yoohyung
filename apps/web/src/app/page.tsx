import { Metadata } from 'next';
import { HomePage } from '@/pages/home';

export const metadata: Metadata = {
    title: 'TypologyLab - 심리테스트 플랫폼',
    description: '나만의 성향을 알아보는 재미있는 심리테스트를 만나보세요. 에겐·테토 테스트부터 다양한 성격 분석까지.',
    openGraph: {
        title: 'TypologyLab - 심리테스트 플랫폼',
        description: '나만의 성향을 알아보는 재미있는 심리테스트를 만나보세요.',
        type: 'website',
    },
};

export default function Page() {
    return <HomePage />;
}

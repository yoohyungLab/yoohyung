import { Metadata } from 'next';
import HomePage from '@/pages/home/home-page';
import { homeService } from '@/shared/api/services/home.service';

export function generateMetadata(): Metadata {
	// 빌드 시에는 정적 메타데이터만 사용
	const testCount = 0;

	return {
		title: '픽키드 - 나를 알아가는 심리테스트',
		description: `재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요. Z세대를 위한 트렌디한 테스트 플랫폼. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
		keywords: ['심리테스트', '성격분석', '밸런스게임', 'MBTI', '자기계발', '픽키드', 'Z세대'],
		authors: [{ name: '픽키드' }],
		creator: '픽키드',
		publisher: '픽키드',
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		metadataBase: new URL('https://pickid.com'),
		alternates: {
			canonical: '/',
		},
		openGraph: {
			type: 'website',
			url: 'https://pickid.com',
			title: '픽키드 - 나를 알아가는 심리테스트',
			description: `재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
			siteName: '픽키드',
			images: [
				{
					url: '/og-image.png',
					width: 1200,
					height: 630,
					alt: '픽키드 - 심리테스트 플랫폼',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: '픽키드 - 나를 알아가는 심리테스트',
			description: `재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
			creator: '@pickid',
			images: ['/og-image.png'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		verification: {
			google: 'your-google-verification-code',
		},
	};
}

export default function Page() {
	return <HomePage />;
}

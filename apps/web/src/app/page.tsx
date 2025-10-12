import { Metadata } from 'next';
import { HomePageClient } from '@/features/home';
import { homeService } from '@/shared/api/services/home.service';

export function generateMetadata(): Metadata {
	const testCount = 0;

	return {
		title: '픽키드 - 나를 알아가는 테스트',
		description: `심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
		keywords: ['심리테스트', '성격분석', '밸런스게임', 'MBTI', '자기계발', '픽키드', 'Z세대'],
		authors: [{ name: '픽키드' }],
		creator: '픽키드',
		publisher: '픽키드',
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr'),
		alternates: {
			canonical: '/',
		},
		openGraph: {
			type: 'website',
			url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
			title: '픽키드 - 나를 알아가는 테스트',
			description: `심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
			siteName: '픽키드',
			images: [
				{
					url: '/og-image.png',
					width: 1200,
					height: 630,
					alt: '픽키드 - 나를 알아가는 테스트',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: '픽키드 - 나를 알아가는 테스트',
			description: `심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`,
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

export default async function Page() {
	// 서버에서 실제 데이터 가져오기
	const data = await homeService.getHomePageData();

	return (
		<HomePageClient
			tests={data.tests}
			categories={data.categories}
			popularTests={data.popularTests}
			recommendedTests={data.recommendedTests}
			topByType={data.topByType}
		/>
	);
}

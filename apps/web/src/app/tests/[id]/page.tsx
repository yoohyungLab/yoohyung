import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testService } from '@/api/services/test.service';
import { SITE_CONFIG } from '@/constants/site-config';
import { TestPageClient } from '@/app/tests/components/test-page-client';

interface IPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IPageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const testData = await testService.getTestWithDetails(id);

		if (!testData) {
			return {
				title: '테스트',
				description: '심리테스트를 진행해보세요.',
			};
		}

		const testTitle = (testData.test?.title as string) || '테스트';
		const testDescription = (testData.test?.description as string) || '심리테스트를 진행해보세요.';
		const ogImage = (testData.test?.thumbnail_url as string) || undefined;

		return {
			title: testTitle,
			description: testDescription,
			keywords: [...SITE_CONFIG.keywords, testTitle, testData.test?.type === 'balance' ? '밸런스게임' : '심리테스트'],
			...(ogImage && {
				openGraph: {
					images: [{ url: ogImage, width: 1200, height: 630, alt: testTitle }],
				},
			}),
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return {
			title: '테스트',
			description: '심리테스트를 진행해보세요.',
		};
	}
}

export default async function TestDetailPage({ params }: IPageProps) {
	const { id } = await params;

	if (!id) notFound();

	try {
		const testData = await testService.getTestWithDetails(id);

		if (!testData) notFound();

		return <TestPageClient test={testData} />;
	} catch (error) {
		console.error('테스트 정보 로드 실패:', error);
		notFound();
	}
}

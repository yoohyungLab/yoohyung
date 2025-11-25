import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testService } from '@/api/services/test.service';
import { generatePageMetadata } from '@/lib/metadata';
import { SITE_CONFIG } from '@/components/config/metadata';
import { TestPageClient } from '@/app/tests/components/test-page-client';

interface IPageProps {
	params: Promise<{ id: string }>;
}

const DEFAULT_METADATA = generatePageMetadata({
	title: '테스트',
	description: '심리테스트를 진행해보세요.',
});

export async function generateMetadata({ params }: IPageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const testData = await testService.getTestWithDetails(id);

		if (!testData) return DEFAULT_METADATA;

		const testTitle = (testData.test?.title as string) || '테스트';
		const testDescription = (testData.test?.description as string) || '심리테스트를 진행해보세요.';
		const ogImage = (testData.test?.thumbnail_url as string) || SITE_CONFIG.ogImage;

		return {
			...generatePageMetadata({
				title: testTitle,
				description: testDescription,
				path: `/tests/${testData.test?.id}`,
				ogImage,
			}),
			keywords: [...SITE_CONFIG.keywords, testTitle, testData.test?.type === 'balance' ? '밸런스게임' : '심리테스트'],
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return DEFAULT_METADATA;
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

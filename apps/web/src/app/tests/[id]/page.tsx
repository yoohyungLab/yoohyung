import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testService } from '@/shared/api/services/test.service';
import { categoryService } from '@/shared/api/services/category.service';
import { generatePageMetadata } from '@/shared/lib/metadata';
import { SITE_CONFIG } from '@/shared/config/metadata';
import { mapTestWithDetailsToNested } from '@/shared/lib/test-mappers';
import { TestPageClient } from '@/features/test';

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

		const testTitle = testData.title || '테스트';
		const testDescription = testData.description || '심리테스트를 진행해보세요.';
		const ogImage = testData.thumbnail_url || SITE_CONFIG.ogImage;

		return {
			...generatePageMetadata({
				title: testTitle,
				description: testDescription,
				path: `/tests/${testData.id}`,
				ogImage,
			}),
			keywords: [...SITE_CONFIG.keywords, testTitle, testData.type === 'balance' ? '밸런스게임' : '심리테스트'],
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return DEFAULT_METADATA;
	}
}

export default async function TestDetailPage({ params }: IPageProps) {
	const { id } = await params;

	if (!id) {
		notFound();
	}

	try {
		const [testData, categories] = await Promise.all([
			testService.getTestWithDetails(id),
			categoryService.getAllCategories(),
		]);

		if (!testData) {
			notFound();
		}

		const test = mapTestWithDetailsToNested(testData);

		return <TestPageClient test={test} categories={categories} />;
	} catch (error) {
		console.error('테스트 정보 로드 실패:', error);
		notFound();
	}
}

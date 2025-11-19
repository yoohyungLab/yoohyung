import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testService } from '@/shared/api/services/test.service';
import { generatePageMetadata } from '@/shared/lib/metadata';
import { SITE_CONFIG } from '@/shared/config/metadata';
import { TestResultPageClient } from '@/features/test/ui/test-result-page-client';

interface IPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ ref?: string }>;
}

const DEFAULT_METADATA = generatePageMetadata({
	title: '테스트 결과',
	description: '심리테스트 결과를 확인해보세요.',
});

export async function generateMetadata({ params, searchParams }: IPageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const { ref } = await searchParams;
		const isSharedLink = ref === 'share';

		const test = await testService.getTestById(id);
		if (!test) return DEFAULT_METADATA;

		const testName = (test.title as string) || '테스트';
		const testDescription = (test.description as string) || '심리테스트 결과를 확인해보세요.';
		const title = isSharedLink ? `${testName} 친구 결과` : `${testName} 결과`;
		const description = isSharedLink
			? `친구가 ${testName} 결과를 공유했어요! 나도 테스트해보세요.`
			: `${testDescription} 나도 테스트하기 →`;
		const ogImage = (test.thumbnail_url as string) || SITE_CONFIG.ogImage;

		return {
			...generatePageMetadata({
				title,
				description,
				path: `/tests/${test.id}/result${isSharedLink ? '?ref=share' : ''}`,
				ogImage,
				noIndex: isSharedLink,
			}),
			keywords: [...SITE_CONFIG.keywords, testName, test.type === 'balance' ? '밸런스게임' : '심리테스트'],
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return DEFAULT_METADATA;
	}
}

export default async function TestResultPage({ params }: IPageProps) {
	const { id } = await params;

	try {
		// ==================== SSR: Data Fetching Only ====================
		const test = await testService.getTestById(id);

		if (!test) {
			notFound();
		}

		const testType = (test.type as string) || 'psychology';

		// ==================== Delegate to Client Component ====================
		return <TestResultPageClient testId={id} testType={testType} />;
	} catch (error) {
		console.error('테스트 정보 로드 실패:', error);
		notFound();
	}
}

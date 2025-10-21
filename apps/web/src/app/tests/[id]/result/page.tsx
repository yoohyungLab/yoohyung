import { Metadata } from 'next';
import { TestResultContainer } from '@/features/test/ui/test-result-container';
import { BalanceGameResultContainer } from '@/features/test/ui/balance-game/balance-game-result-container';
import { testService } from '@/shared/api/services/test.service';
import { generatePageMetadata } from '@/shared/lib/metadata';
import { SITE_CONFIG } from '@/shared/config/metadata';

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

		const testName = test.title || '테스트';
		const testDescription = test.description || '심리테스트 결과를 확인해보세요.';

		// 타이틀: "테스트명 결과 | 픽키드" 형식으로 통일
		const title = isSharedLink ? `${testName} 친구 결과` : `${testName} 결과`;

		const description = isSharedLink
			? `친구가 ${testName} 결과를 공유했어요! 나도 테스트해보세요.`
			: `${testDescription} 나도 테스트하기 →`;

		const ogImage = test.thumbnail_url || SITE_CONFIG.ogImage;

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

// 메인 컴포넌트 (Server Component - Suspense 불필요)
export default async function TestResultPage({ params }: IPageProps) {
	const { id } = await params;

	try {
		const test = await testService.getTestById(id);

		if (!test) {
			return <div>테스트를 찾을 수 없습니다.</div>;
		}

		if (test.type === 'balance') {
			return <BalanceGameResultContainer />;
		}

		return <TestResultContainer />;
	} catch (error) {
		console.error('테스트 정보 로드 실패:', error);
		return <div>테스트를 불러오는데 실패했습니다.</div>;
	}
}

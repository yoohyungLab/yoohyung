import { Metadata } from 'next';
import { HomeContainer } from '@/components/home-container';
import { homeService } from '@/api/services/home.service';
import { generatePageMetadata } from '@/lib/metadata';
import { SITE_CONFIG } from '@/components/config/metadata';

const DEFAULT_METADATA = {
	...generatePageMetadata({
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		path: '/',
	}),
	title: SITE_CONFIG.title,
	alternates: {
		canonical: '/',
	},
};

// 홈 페이지 메타데이터 (동적 - 테스트 개수 표시)
export async function generateMetadata(): Promise<Metadata> {
	try {
		const data = await homeService.getHomePageData();
		const testCount = data.tests.length;

		const description =
			testCount > 0
				? `심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`
				: SITE_CONFIG.description;

		return {
			...generatePageMetadata({
				title: SITE_CONFIG.title, // "픽키드 - 나를 알아가는 심리테스트" (template 미적용)
				description,
				path: '/',
			}),
			title: SITE_CONFIG.title, // template 무시하고 고정값 사용
			alternates: {
				canonical: '/',
			},
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return DEFAULT_METADATA;
	}
}

export default async function Page() {
	try {
		const data = await homeService.getHomePageData();

		return (
			<HomeContainer
				tests={data.tests}
				categories={data.categories}
				popularTests={data.popularTests}
				recommendedTests={data.recommendedTests}
				topByType={data.topByType}
			/>
		);
	} catch (error) {
		console.error('홈 페이지 데이터 로드 실패:', error);
		throw error;
	}
}

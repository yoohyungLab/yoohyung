import { Metadata } from 'next';
import type { Test, Category, TestCard } from '@pickid/supabase';
import { HomeContainer } from '@/components/home-container';
import { homeService } from '@/api/services/home.service';
import { SITE_CONFIG } from '@/constants/site-config';
import { transformTestsToCards } from '@/lib';

// 홈 페이지 메타데이터 (동적 - 테스트 개수 표시)
export async function generateMetadata(): Promise<Metadata> {
	try {
		const { tests } = await homeService.getHomePageData();
		const testCount = tests.length;

		const description =
			testCount > 0
				? `심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. 총 ${testCount}개의 다양한 테스트를 만나보세요.`
				: SITE_CONFIG.description;

		return {
			title: SITE_CONFIG.title, // template 무시하고 고정값 사용
			description,
			alternates: {
				canonical: '/',
			},
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return {
			title: SITE_CONFIG.title,
			description: SITE_CONFIG.description,
			alternates: {
				canonical: '/',
			},
		};
	}
}

// 홈 페이지 데이터 가공 함수들
function getPopularTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);
	return [...testCards].sort((a, b) => (b.completions || 0) - (a.completions || 0)).slice(0, limit);
}

function getRecommendedTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);
	const twoWeeksAgo = new Date();
	twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
	const recentTests = tests.filter((test) => new Date(test.created_at) >= twoWeeksAgo);

	if (recentTests.length > 0) {
		return recentTests
			.map((test) => testCards.find((card) => card.id === test.id)!)
			.filter(Boolean)
			.sort((a, b) => (b.starts || 0) - (a.starts || 0))
			.slice(0, limit);
	}

	return [...testCards].sort((a, b) => (b.starts || 0) - (a.starts || 0)).slice(0, limit);
}

function getTopTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);

	return [...testCards]
		.filter((test) => (test.starts || 0) > 10)
		.map((test) => ({
			...test,
			completionRate: (test.starts || 0) > 0 ? ((test.completions || 0) / (test.starts || 0)) * 100 : 0,
		}))
		.sort((a, b) => {
			if (Math.abs(b.completionRate - a.completionRate) < 0.1) {
				return (b.completions || 0) - (a.completions || 0);
			}
			return b.completionRate - a.completionRate;
		})
		.slice(0, limit);
}

export default async function Page() {
	try {
		const { tests, categories } = await homeService.getHomePageData();
		const testCards = transformTestsToCards(tests, categories);

		return (
			<HomeContainer
				tests={testCards}
				categories={categories}
				popularTests={getPopularTests(tests, categories)}
				recommendedTests={getRecommendedTests(tests, categories)}
				topByType={getTopTests(tests, categories)}
			/>
		);
	} catch (error) {
		console.error('홈 페이지 데이터 로드 실패:', error);
		throw error;
	}
}

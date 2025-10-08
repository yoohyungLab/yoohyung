import { HomePageClient } from '@/features/home/components/home-page-content';
import { homeService } from '@/shared/api/services/home.service';
import type { TestCard } from '@/shared/types/home';
import type { Category } from '@pickid/supabase';

export default async function HomePage() {
	let data: {
		tests: TestCard[];
		categories: Category[];
		popularTests: TestCard[];
		recommendedTests: TestCard[];
		topByType: TestCard[];
	} = {
		tests: [],
		categories: [],
		popularTests: [],
		recommendedTests: [],
		topByType: [],
	};

	try {
		data = await homeService.getHomePageData();
	} catch {
		// 환경 변수가 없을 때 기본값 사용
	}

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

import { HomePageClient } from '@/features/home/components/home-page-content';
import { homeService } from '@/shared/api/services/home.service';
import type { TestCard } from '@/shared/types/home';
import type { Category } from '@pickid/supabase';

export default function HomePage() {
	// 빌드 시에는 정적 데이터만 사용
	const data = {
		tests: [],
		categories: [],
		popularTests: [],
		recommendedTests: [],
		topByType: [],
	};

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

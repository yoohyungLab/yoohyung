import { CategoryFilter, BannerCarousel } from '@/features/home';
import { TestSection } from './test-section';
import BalanceGameSection from './balance-game-section';
import type { TestCard, Banner } from '@/shared/types';
import type { Category } from '@pickid/supabase';

// 배너 데이터 - 상수로 분리
const BANNERS: Banner[] = [
	{ id: 'banner-1', image: '/images/banner-2.png' },
	{ id: 'banner-2', image: '/images/banner-2.png' },
	{ id: 'banner-3', image: '/images/banner-2.png' },
];

interface HomeContainerProps {
	tests: TestCard[];
	categories: Category[];
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
}

export function HomeContainer({ tests, categories, popularTests, recommendedTests, topByType }: HomeContainerProps) {
	return (
		<>
			<header>
				<BannerCarousel banners={BANNERS} />
			</header>

			<main className="min-h-screen bg-gray-50">
				<h1 className="sr-only">픽키드</h1>
				<nav className="max-w-7xl mx-auto px-4 py-6" aria-label="테스트 카테고리">
					<CategoryFilter categories={categories} />
				</nav>

				<section className="max-w-7xl mx-auto px-4 space-y-8">
					<TestSection tests={popularTests} title="인기 테스트" variant="carousel" size="small" sectionType="popular" />

					<BalanceGameSection />

					{tests.length > 0 && (
						<TestSection tests={tests} title="새로 추가된 테스트" variant="carousel" size="small" sectionType="new" />
					)}

					<TestSection
						tests={recommendedTests}
						title="추천 테스트"
						variant="carousel"
						size="medium"
						sectionType="recommended"
					/>

					<TestSection
						tests={topByType}
						title="명예의 전당"
						variant="grid"
						size="small"
						className="pb-12"
						sectionType="trending"
					/>
				</section>
			</main>
		</>
	);
}

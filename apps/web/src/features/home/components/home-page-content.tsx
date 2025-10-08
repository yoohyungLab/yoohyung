import { CategoryFilter, BannerCarousel } from '@/features/home';
import { TestSection } from '@/features/home/ui/test-section';
import BalanceGameSection from '@/pages/home/balance';
import type { TestCard, Banner } from '@/shared/types/home';
import type { Category } from '@pickid/supabase';

// 배너 데이터 - 상수로 분리
const BANNERS: Banner[] = [
	{ id: 'banner-1', image: '/images/banner-2.png' },
	{ id: 'banner-2', image: '/images/banner-2.png' },
	{ id: 'banner-3', image: '/images/banner-2.png' },
];

interface HomePageClientProps {
	tests: TestCard[];
	categories: Category[];
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
}

export function HomePageClient({ tests, categories, popularTests, recommendedTests, topByType }: HomePageClientProps) {
	return (
		<>
			<header className="w-full">
				<BannerCarousel banners={BANNERS} />
			</header>

			<main className="min-h-screen bg-gray-50">
				<nav className="max-w-7xl mx-auto px-4 py-6" aria-label="테스트 카테고리">
					<CategoryFilter categories={categories} />
				</nav>

				<div className="max-w-7xl mx-auto px-4">
					<TestSection tests={popularTests} title="인기 테스트" variant="carousel" size="small" />

					<BalanceGameSection />

					{tests.length > 0 && <TestSection tests={tests} title="새로 추가된 테스트" variant="carousel" size="small" />}

					<TestSection tests={recommendedTests} title="추천 테스트" variant="carousel" size="medium" />

					<TestSection tests={topByType} title="명예의 전당" variant="grid" size="small" className="pb-12" />
				</div>
			</main>
		</>
	);
}

import { CategoryFilter } from '@/components/category-filter';
import { BannerCarousel } from '@/components/banner-carousel';
import { TestSection } from './test-section';
import BalanceGameSection from './balance-game-section';
import { AdBannerInline } from './ad-banner-inline';
import type { Category, TestCard } from '@pickid/supabase';
import { HOME_BANNERS } from '@/constants';

interface HomeContainerProps {
	tests: TestCard[];
	categories: Category[];
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
}

export function HomeContainer(props: HomeContainerProps) {
	const { tests, categories, popularTests, recommendedTests, topByType } = props;

	return (
		<>
			<header role="banner">
				<BannerCarousel banners={HOME_BANNERS} />
			</header>

			<main className="min-h-screen bg-gray-50">
				<h1 className="sr-only">픽키드 - 나를 알아가는 심리테스트, 성격분석, 밸런스게임</h1>

				<nav className="max-w-7xl mx-auto px-4 py-6" aria-label="테스트 카테고리">
					<CategoryFilter categories={categories} />
				</nav>

				<div className="max-w-7xl mx-auto px-4">
					<TestSection tests={popularTests} title="인기 테스트" sectionType="popular" />

					<BalanceGameSection />

					{tests.length > 0 && <TestSection tests={tests} title="새로 추가된 테스트" sectionType="new" />}

					<AdBannerInline />

					<TestSection tests={recommendedTests} title="추천 테스트" sectionType="recommended" />

					<TestSection tests={topByType} title="명예의 전당" sectionType="trending" className="pb-12" />
				</div>
			</main>
		</>
	);
}

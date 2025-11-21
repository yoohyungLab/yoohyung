import { CategoryFilter } from '@/features/home/ui/category-filter';
import { BannerCarousel } from '@/features/home/ui/banner-carousel';
import { TestSection } from './test-section';
import BalanceGameSection from './balance-game-section';
import type { TestCard, Banner } from '@/shared/types';
import type { Category } from '@pickid/supabase';
import { AdBannerInline } from './ad-banner-inline';

interface HomeContainerProps {
	tests: TestCard[];
	categories: Category[];
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
}

export function HomeContainer(props: HomeContainerProps) {
	const { tests, categories, popularTests, recommendedTests, topByType } = props;

	const banners: Banner[] = [
		{ id: '73c68247-907f-49c7-a5c5-e74f4b990232', image: '/images/banner-5.svg' },
		{ id: 'e0b80003-0c7c-4daf-a792-076dd0a284ee', image: '/images/banner-4.svg' },
		{ id: 'eec5eb18-3629-4e44-b18a-88fc3b8f2446', image: '/images/banner-2.png' },
		{ id: '1f3bf2c8-4f8d-4df2-80f8-5f551654a025', image: '/images/banner-1.svg' },
		{ id: '73c68247-907f-49c7-a5c5-e74f4b990232', image: '/images/banner-3.svg' },
	];

	return (
		<>
			<header role="banner">
				<BannerCarousel banners={banners} />
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

					{/* 중간 영역 광고 배너 */}
					<AdBannerInline />

					<TestSection tests={recommendedTests} title="추천 테스트" sectionType="recommended" />

					<TestSection tests={topByType} title="명예의 전당" sectionType="trending" className="pb-12" />
				</div>
			</main>
		</>
	);
}

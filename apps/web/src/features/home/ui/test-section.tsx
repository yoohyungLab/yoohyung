'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@pickid/ui';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import { SectionBadge } from '@/shared/ui/badge/section-badge';
import type { TestCardProps } from '@/shared/types/home';

type TestSectionVariant = 'carousel' | 'grid';
type TestSectionSize = 'small' | 'medium' | 'large';
type TestSectionType = 'popular' | 'new' | 'recommended' | 'trending' | 'default';

interface TestSectionProps {
	tests: TestCardProps[];
	title: string;
	variant?: TestSectionVariant;
	size?: TestSectionSize;
	showCarousel?: boolean;
	className?: string;
	sectionType?: TestSectionType;
	badgeText?: string;
	description?: string;
}

const sizeConfig = {
	small: {
		carousel: 'basis-[180px] sm:basis-[200px]',
		grid: 'grid-cols-2',
		spacing: 'pl-3 -ml-3',
	},
	medium: {
		carousel: 'basis-[280px]',
		grid: 'grid-cols-2 sm:grid-cols-3',
		spacing: 'pl-2 -ml-2',
	},
	large: {
		carousel: 'basis-[320px]',
		grid: 'grid-cols-2 sm:grid-cols-4',
		spacing: 'pl-4 -ml-4',
	},
};

const sectionTypeConfig = {
	popular: {
		badgeVariant: 'popular' as const,
		defaultBadgeText: 'hot',
	},
	new: {
		badgeVariant: 'new' as const,
		defaultBadgeText: 'new',
	},
	recommended: {
		badgeVariant: 'recommended' as const,
		defaultBadgeText: '추천',
	},
	trending: {
		badgeVariant: 'trending' as const,
		defaultBadgeText: '트렌딩',
	},
	default: {
		badgeVariant: 'default' as const,
		defaultBadgeText: '테스트',
	},
};

export function TestSection({
	tests,
	title,
	variant = 'carousel',
	size = 'small',
	showCarousel = true,
	className = '',
	sectionType = 'default',
	badgeText,
	description,
}: TestSectionProps) {
	const config = sizeConfig[size];
	const sectionConfig = sectionTypeConfig[sectionType];
	const finalBadgeText = badgeText || sectionConfig.defaultBadgeText || '';

	// 섹션 헤더 컴포넌트
	const SectionHeader = () => (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2">
					<h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`} className={`text-2xl font-bold`}>
						{title}
					</h2>
				</div>
				{finalBadgeText && <SectionBadge variant={sectionConfig.badgeVariant}>{finalBadgeText}</SectionBadge>}
			</div>
			{tests.length > 0 && <div className="text-sm text-gray-500 font-medium">{tests.length}개 테스트</div>}
		</div>
	);

	if (variant === 'grid') {
		return (
			<section className={`py-8 ${className}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
				<SectionHeader />
				{description && <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>}
				<div className={`grid ${config.grid} gap-4`}>
					{tests.map((test) => (
						<CarouselCard key={test.id} {...test} description={test.description || ''} />
					))}
					{tests.length % 2 !== 0 && <div className="hidden sm:block" />}
				</div>
			</section>
		);
	}

	return (
		<section className={`py-8 ${className}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
			<SectionHeader />
			{description && <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>}
			<Carousel className="w-full">
				<CarouselContent className={`${config.spacing} gap-4`}>
					{tests.map((test) => (
						<CarouselItem key={test.id} className={`${config.spacing} ${config.carousel}`}>
							<CarouselCard {...test} description={test.description || ''} />
						</CarouselItem>
					))}
				</CarouselContent>
				{showCarousel && tests.length > 2 && (
					<>
						<CarouselPrevious />
						<CarouselNext />
					</>
				)}
			</Carousel>
		</section>
	);
}

'use client';

import Image from 'next/image';
import { DefaultCarousel } from '@repo/ui';

interface Banner {
	id: string;
	image: string;
	ctaAction?: () => void;
}

interface BannerCarouselProps {
	banners: Banner[];
	autoPlay?: boolean;
	autoPlayInterval?: number;
	className?: string;
}

export function BannerCarousel({
	banners,
	autoPlay = true,
	autoPlayInterval = 5000,
	className = '',
}: BannerCarouselProps) {
	console.log('BannerCarousel rendered with banners:', banners);

	if (banners.length === 0) {
		console.log('No banners, returning null');
		return null;
	}

	// 배너를 React 노드로 변환
	const bannerItems = banners.map((banner, index) => (
		<div key={banner.id} className="relative w-full h-full">
			<Image
				src={banner.image}
				alt={`배너 ${index + 1}`}
				fill
				className="object-cover select-none"
				priority={index === 0}
				draggable={false}
			/>
		</div>
	));

	return (
		<DefaultCarousel
			items={bannerItems}
			autoPlay={autoPlay}
			autoPlayInterval={autoPlayInterval}
			showArrows={false}
			showDots={true}
			aspectRatio="aspect-[3/2]"
			className={`w-full overflow-hidden ${className}`}
		/>
	);
}

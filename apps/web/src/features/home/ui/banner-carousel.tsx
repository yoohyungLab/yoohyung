'use client';

import Image from 'next/image';
import { DefaultCarousel } from '@pickid/ui';

interface Banner {
	id: string;
	image: string;
}

interface BannerCarouselProps {
	banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
	if (banners.length === 0) return null;

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

	return <DefaultCarousel items={bannerItems} className="w-full" />;
}

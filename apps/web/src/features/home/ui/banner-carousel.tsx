'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { DefaultCarousel } from '@pickid/ui';
import type { Banner } from '@/shared/types';

interface BannerCarouselProps {
	banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
	const router = useRouter();

	const handleBannerClick = useCallback(
		(banner: Banner) => {
			router.push(`/tests/${banner.id}`);
		},
		[router]
	);

	if (banners.length === 0) return null;

	const bannerItems = banners.map((banner, index) => (
		<div key={banner.id} className="relative w-full h-full cursor-pointer" onClick={() => handleBannerClick(banner)}>
			<Image
				src={banner.image}
				alt={`배너 ${index + 1}`}
				fill
				className="object-cover select-none"
				priority={index === 0}
				draggable={false}
				sizes="100vw"
				quality={95}
			/>
		</div>
	));

	return <DefaultCarousel items={bannerItems} className="w-full" />;
}

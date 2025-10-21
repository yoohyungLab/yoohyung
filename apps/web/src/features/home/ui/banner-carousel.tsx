'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DefaultCarousel } from '@pickid/ui';
import type { Banner } from '@/shared/types';

interface BannerCarouselProps {
	banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
	const router = useRouter();

	if (banners.length === 0) return null;

	const handleBannerClick = (banner: Banner) => {
		router.push(`/tests/${banner.id}`);
	};

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
			/>
		</div>
	));

	return <DefaultCarousel items={bannerItems} className="w-full" />;
}

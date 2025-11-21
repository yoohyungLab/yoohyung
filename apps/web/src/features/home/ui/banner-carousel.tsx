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

	const bannerItems = banners.map((banner, index) => (
		<div key={banner.id} className="relative w-full h-full cursor-pointer" onClick={() => router.push(`/tests/${banner.id}`)}>
			<Image
				src={banner.image}
				alt={`배너 ${index + 1}`}
				fill
				className="object-cover select-none"
				priority={index === 0}
				draggable={false}
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
				quality={100}
			/>
		</div>
	));

	return <DefaultCarousel items={bannerItems} className="w-full" />;
}

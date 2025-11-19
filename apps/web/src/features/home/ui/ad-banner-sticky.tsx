'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@pickid/ui';
import { X } from 'lucide-react';

const AD_CONFIG = {
	imageUrl: '/images/workai-banner.png',
	linkUrl: 'https://afterworkai.club/',
} as const;

export function AdBannerSticky() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 w-screen">
			<div className="relative bg-white border-t shadow-2xl w-full">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsVisible(false)}
					className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 z-10"
					aria-label="광고 닫기"
				>
					<X className="w-4 h-4" />
				</Button>

				<button
					onClick={() => window.open(AD_CONFIG.linkUrl, '_blank', 'noopener,noreferrer')}
					className="relative w-full cursor-pointer block"
					style={{ aspectRatio: '900/450', maxHeight: '300px' }}
					aria-label="광고 배너 클릭"
				>
					<Image
						src={AD_CONFIG.imageUrl}
						alt="광고 배너"
						fill
						className="object-contain"
						sizes="(max-width: 900px) 100vw, 900px"
						loading="lazy"
					/>
				</button>
			</div>
		</div>
	);
}

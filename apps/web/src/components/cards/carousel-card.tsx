'use client';

import { memo } from 'react';
import { BaseCard, CardImage, CardTags, CardContent } from './base-card';

interface CarouselCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	href?: string;
	className?: string;
}

export const CarouselCard = memo(function CarouselCard({
	id,
	title,
	description,
	image,
	tags,
	href = `/tests/${id}`,
	className,
}: CarouselCardProps) {
	return (
		<BaseCard href={href} variant="default" size="md" aspectRatio="portrait" className={className}>
			<div className="relative h-full w-full">
				<CardImage
					src={image}
					alt={title || '테스트 이미지'}
					overlay
					overlayGradient="from-black/70 via-black/10 to-transparent"
				/>

				{/* 태그 */}
				<div className="absolute top-2.5 left-2.5 max-w-[calc(100%-3rem)] z-10">
					<CardTags tags={tags} maxVisible={2} size="xs" />
				</div>

				{/* 즐겨찾기 버튼 - 향후 기능 */}

				{/* 콘텐츠 */}
				<CardContent className="absolute bottom-0 left-0 right-0 z-10">
					<h3 className="font-extrabold text-white text-sm leading-tight line-clamp-2 mb-0.5">{title}</h3>
					<p className="text-[11px] text-white/70 line-clamp-1 font-medium whitespace-pre-line">{description}</p>
				</CardContent>
			</div>
		</BaseCard>
	);
});

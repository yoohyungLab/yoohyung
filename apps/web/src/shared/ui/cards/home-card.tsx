'use client';

import { memo } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@pickid/shared';
import { BaseCard, CardImage, CardTags, CardContent } from './base-card';

interface HomeCardProps {
	id: string;
	title: string;
	image: string;
	tags: string[];
	isFavorite: boolean;
	onToggleFavorite: (id: string) => void;
	href?: string;
	className?: string;
}

export const HomeCard = memo(function HomeCard({
	id,
	title,
	image,
	tags,
	isFavorite,
	onToggleFavorite,
	href = `/tests/${id}`,
	className,
}: HomeCardProps) {
	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onToggleFavorite(id);
	};

	return (
		<BaseCard
			href={href}
			variant="default"
			size="md"
			aspectRatio="square"
			className={className}
		>
			<div className="relative h-full">
				<CardImage
					src={image}
					alt={title}
					overlay
					overlayGradient="from-black/20 to-transparent"
				/>
				
				{/* 태그 */}
				<div className="absolute top-2 left-2 max-w-[calc(100%-60px)]">
					<CardTags tags={tags} maxVisible={2} size="sm" />
				</div>

				{/* 즐겨찾기 버튼 */}
				<button
					onClick={handleToggleFavorite}
					className={cn(
						'absolute top-2 right-2 p-1 rounded-full transition-colors',
						isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
					)}
				>
					<Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
				</button>

				{/* 제목 */}
				<CardContent className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm">
					<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
						{title}
					</h3>
				</CardContent>
			</div>
		</BaseCard>
	);
});

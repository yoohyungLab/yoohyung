'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@repo/shared';

interface CarouselCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	isFavorite?: boolean;
	onToggleFavorite?: (id: string) => void;
	showFavoriteButton?: boolean;
	href?: string;
	className?: string;
}

export function CarouselCard({
	id,
	title,
	description,
	image,
	tags,
	isFavorite = false,
	onToggleFavorite,
	showFavoriteButton = true,
	href = `/tests/${id}`,
	className,
}: CarouselCardProps) {
	const content = (
		<div className={cn('group relative overflow-hidden', className)}>
			<div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
				<div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

					{tags[0] && (
						<div className="absolute top-2.5 left-2.5">
							<span className="inline-block text-[10px] font-bold bg-white text-gray-900 px-2 py-1 rounded-full">
								{tags[0]}
							</span>
						</div>
					)}

					{showFavoriteButton && onToggleFavorite && (
						<button
							onClick={(e) => {
								e.preventDefault();
								onToggleFavorite(id);
							}}
							className={cn(
								'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all',
								isFavorite ? 'bg-white shadow-md hover:scale-110' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
							)}
						>
							<Heart
								className={cn('w-4 h-4 transition-all', isFavorite ? 'fill-red-500 text-red-500' : 'text-white')}
							/>
						</button>
					)}

					<div className="absolute bottom-0 left-0 right-0 p-3">
						<h3 className="font-extrabold text-white text-sm leading-tight line-clamp-2 mb-0.5">{title}</h3>
						<p className="text-[11px] text-white/70 line-clamp-1 font-medium">{description}</p>
					</div>
				</div>
			</div>
		</div>
	);

	return href ? (
		<a href={href} className="block">
			{content}
		</a>
	) : (
		content
	);
}

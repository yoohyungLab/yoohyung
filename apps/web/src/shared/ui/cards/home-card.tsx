'use client';

import { memo } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@pickid/shared';

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
	const CardContent = (
		<div
			className={cn(
				'group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow',
				className
			)}
		>
			<div className="block">
				<div className="aspect-square relative overflow-hidden">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
						priority={false}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
					<div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-60px)]">
						{tags.map((tagName, index) => (
							<span key={index} className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-full font-medium">
								{tagName}
							</span>
						))}
					</div>
				</div>
				<div className="p-3">
					<div className="flex items-start justify-between">
						<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
							{title}
						</h3>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onToggleFavorite(id);
							}}
							className={cn(
								'ml-2 p-1 rounded-full transition-colors',
								isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
							)}
						>
							<Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block" prefetch={false}>
				{CardContent}
			</Link>
		);
	}

	return CardContent;
});

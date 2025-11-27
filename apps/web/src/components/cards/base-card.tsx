'use client';

import { memo, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@pickid/shared';
import Image from 'next/image';

// 공통 카드 타입 정의export type CardVariant = 'default' | 'outline' | 'elevated' | 'minimal' | 'gradient';
export type CardSize = 'sm' | 'md' | 'lg';
export type CardAspectRatio = 'square' | 'video' | 'portrait' | 'landscape' | 'auto';

interface BaseCardProps {
	children: ReactNode;
	href?: string;
	variant?: CardVariant;
	size?: CardSize;
	aspectRatio?: CardAspectRatio;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
}

// 베이스 카드 컴포넌트
export const BaseCard = memo(function BaseCard({
	children,
	href,
	variant = 'default',
	size = 'md',
	aspectRatio = 'auto',
	className,
	onClick,
	disabled = false,
}: BaseCardProps) {
	const variantClasses = {
		default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
		outline: 'bg-white border-2 border-gray-300 hover:border-gray-400',
		elevated: 'bg-white shadow-lg hover:shadow-xl border border-gray-100',
		minimal: 'bg-transparent border-0 shadow-none hover:bg-gray-50',
		gradient:
			'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100',
	};

	const sizeClasses = {
		sm: 'rounded-lg',
		md: 'rounded-xl',
		lg: 'rounded-2xl',
	};

	const aspectClasses = {
		square: 'aspect-square',
		video: 'aspect-video',
		portrait: 'aspect-[3/4]',
		landscape: 'aspect-[4/3]',
		auto: '',
	};

	const cardClasses = cn(
		'group relative overflow-hidden transition-all duration-300',
		variantClasses[variant],
		sizeClasses[size],
		aspectClasses[aspectRatio],
		disabled && 'opacity-50 cursor-not-allowed',
		className
	);

	const CardContent = (
		<div className={cardClasses} onClick={disabled ? undefined : onClick}>
			{children}
		</div>
	);

	if (href && !disabled) {
		return (
			<Link href={href} className="block" prefetch={false}>
				{CardContent}
			</Link>
		);
	}

	return CardContent;
});

// 카드 이미지 컴포넌트
interface CardImageProps {
	src: string;
	alt: string;
	className?: string;
	priority?: boolean;
	overlay?: boolean;
	overlayGradient?: string;
}

export const CardImage = memo(function CardImage({
	src,
	alt,
	className,
	priority = false,
	overlay = false,
	overlayGradient = 'from-black/20 to-transparent',
}: CardImageProps) {
	const safeSrc = src || '/images/placeholder.svg';
	return (
		<div className="relative overflow-hidden h-full w-full">
			<Image
				src={safeSrc}
				alt={alt}
				fill
				className={cn('object-cover group-hover:scale-105 transition-transform duration-300', className)}
				priority={priority}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
			{overlay && <div className={cn('absolute inset-0 bg-gradient-to-t', overlayGradient)} />}
		</div>
	);
});

// 카드 태그 컴포넌트
interface CardTagsProps {
	tags: string[];
	maxVisible?: number;
	className?: string;
	size?: 'xs' | 'sm' | 'md';
}

export const CardTags = memo(function CardTags({ tags, maxVisible = 3, className, size = 'sm' }: CardTagsProps) {
	if (tags.length === 0) return null;

	const visibleTags = tags.slice(0, maxVisible);
	const remainingCount = tags.length - maxVisible;

	const sizeClasses = {
		xs: 'text-[10px] px-1.5 py-0.5',
		sm: 'text-xs px-2 py-1',
		md: 'text-sm px-3 py-1.5',
	};

	return (
		<div className={cn('flex flex-wrap gap-1', className)}>
			{visibleTags.map((tag, index) => (
				<span
					key={index}
					className={cn('inline-block font-medium rounded-full bg-white/90 text-gray-700', sizeClasses[size])}
				>
					{tag}
				</span>
			))}
			{remainingCount > 0 && (
				<span className={cn('inline-block font-medium rounded-full bg-white/80 text-gray-600', sizeClasses[size])}>
					+{remainingCount}
				</span>
			)}
		</div>
	);
});

// 카드 콘텐츠 컴포넌트
interface CardContentProps {
	children: ReactNode;
	className?: string;
	padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardContent = memo(function CardContent({ children, className, padding = 'md' }: CardContentProps) {
	const paddingClasses = {
		none: '',
		sm: 'p-2',
		md: 'p-3',
		lg: 'p-4',
	};

	return <div className={cn(paddingClasses[padding], className)}>{children}</div>;
});

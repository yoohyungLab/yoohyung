'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/shared/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
	fallbackSrc?: string;
	className?: string;
	showPlaceholder?: boolean;
}

const DEFAULT_PLACEHOLDER = '/images/placeholder.svg';

export function ImageWithFallback({
	src,
	alt,
	fallbackSrc = DEFAULT_PLACEHOLDER,
	className,
	showPlaceholder = true,
	...props
}: ImageWithFallbackProps) {
	const [imgSrc, setImgSrc] = useState(src);
	const [hasError, setHasError] = useState(false);

	const handleError = () => {
		if (!hasError) {
			setHasError(true);
			setImgSrc(fallbackSrc);
		}
	};

	const handleLoad = () => {
		setHasError(false);
	};

	// src가 없거나 빈 문자열인 경우 placeholder 표시
	if (!src || (typeof src === 'string' && src.trim() === '')) {
		return (
			<div className={cn('relative bg-gray-100 flex items-center justify-center', className)}>
				<Image src={DEFAULT_PLACEHOLDER} alt="이미지 없음" fill className="object-contain opacity-50" {...props} />
			</div>
		);
	}

	return (
		<Image
			src={imgSrc}
			alt={alt}
			className={cn(className, hasError && showPlaceholder && 'opacity-50')}
			onError={handleError}
			onLoad={handleLoad}
			{...props}
		/>
	);
}

// 카드용 이미지 컴포넌트 (기존 CardImage와 호환)
interface CardImageWithFallbackProps {
	src: string;
	alt: string;
	className?: string;
	priority?: boolean;
	overlay?: boolean;
	overlayGradient?: string;
}

export function CardImageWithFallback({
	src,
	alt,
	className,
	priority = false,
	overlay = false,
	overlayGradient = 'from-black/20 to-transparent',
}: CardImageWithFallbackProps) {
	return (
		<div className="relative overflow-hidden h-full w-full">
			<ImageWithFallback
				src={src}
				alt={alt}
				fill
				className={cn('object-cover group-hover:scale-105 transition-transform duration-300', className)}
				priority={priority}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
			{overlay && <div className={cn('absolute inset-0 bg-gradient-to-t', overlayGradient)} />}
		</div>
	);
}

'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { useCarousel as useCarouselHook, type CarouselApi, type UseCarouselOptions } from '../hooks/use-carousel';

type CarouselProps = {
	opts?: UseCarouselOptions['opts'];
	plugins?: UseCarouselOptions['plugins'];
	orientation?: 'horizontal' | 'vertical';
	setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useCarouselHook>['carouselRef'];
	api: ReturnType<typeof useCarouselHook>['api'];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error('useCarousel must be used within a <Carousel />');
	}

	return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
	({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
		const { carouselRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselHook({
			opts,
			plugins,
			orientation,
		});

		const handleKeyDown = React.useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key === 'ArrowLeft') {
					event.preventDefault();
					scrollPrev();
				} else if (event.key === 'ArrowRight') {
					event.preventDefault();
					scrollNext();
				}
			},
			[scrollPrev, scrollNext]
		);

		React.useEffect(() => {
			if (!api || !setApi) {
				return;
			}
			setApi(api);
		}, [api, setApi]);

		return (
			<CarouselContext.Provider
				value={{
					carouselRef,
					api: api,
					opts,
					orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
					scrollPrev,
					scrollNext,
					canScrollPrev,
					canScrollNext,
				}}
			>
				<div
					ref={ref}
					onKeyDownCapture={handleKeyDown}
					className={cn('relative', className)}
					role="region"
					aria-roledescription="carousel"
					{...props}
				>
					{children}
				</div>
			</CarouselContext.Provider>
		);
	}
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const { carouselRef, orientation } = useCarousel();

		return (
			<div ref={carouselRef} className="overflow-hidden">
				<div
					ref={ref}
					className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
					{...props}
				/>
			</div>
		);
	}
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const { orientation } = useCarousel();

		return (
			<div
				ref={ref}
				role="group"
				aria-roledescription="slide"
				className={cn('min-w-0 shrink-0 grow-0', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
				{...props}
			/>
		);
	}
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
		const { orientation, scrollPrev, canScrollPrev } = useCarousel();

		return (
			<Button
				ref={ref}
				variant={variant}
				size={size}
				type="button"
				className={cn(
					'absolute h-10 w-10 rounded-full z-10 shadow-md',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'bg-white hover:bg-gray-100 border-2 border-gray-200',
					orientation === 'horizontal'
						? 'left-2 top-1/2 -translate-y-1/2'
						: 'top-2 left-1/2 -translate-x-1/2 rotate-90',
					className
				)}
				disabled={!canScrollPrev}
				onClick={scrollPrev}
				aria-label="Previous slide"
				{...props}
			>
				<ArrowLeft className="h-5 w-5 text-gray-700" />
			</Button>
		);
	}
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
		const { orientation, scrollNext, canScrollNext } = useCarousel();

		return (
			<Button
				ref={ref}
				variant={variant}
				size={size}
				type="button"
				className={cn(
					'absolute h-10 w-10 rounded-full z-10 shadow-md',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'bg-white hover:bg-gray-100 border-2 border-gray-200',
					orientation === 'horizontal'
						? 'right-2 top-1/2 -translate-y-1/2'
						: 'bottom-2 left-1/2 -translate-x-1/2 rotate-90',
					className
				)}
				disabled={!canScrollNext}
				onClick={scrollNext}
				aria-label="Next slide"
				{...props}
			>
				<ArrowRight className="h-5 w-5 text-gray-700" />
			</Button>
		);
	}
);
CarouselNext.displayName = 'CarouselNext';

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };

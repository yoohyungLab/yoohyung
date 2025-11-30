'use client';

import { useEffect, useState, useRef } from 'react';

interface UseScrollOptions {
	topThreshold?: number;
}

export function useScroll(options: UseScrollOptions = {}) {
	const { topThreshold = 10 } = options;
	const [isVisible, setIsVisible] = useState(true);
	const blocking = useRef(false);
	const prevScrollY = useRef(0);

	useEffect(() => {
		prevScrollY.current = window.scrollY;

		const updateVisibility = () => {
			const scrollY = window.scrollY;

			if (scrollY < topThreshold) {
				setIsVisible(true);
			} else if (scrollY > prevScrollY.current) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			prevScrollY.current = scrollY;
			blocking.current = false;
		};

		const onScroll = () => {
			if (!blocking.current) {
				blocking.current = true;
				window.requestAnimationFrame(updateVisibility);
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [topThreshold]);

	return isVisible;
}


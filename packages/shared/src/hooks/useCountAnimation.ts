'use client';

import { useState, useEffect } from 'react';

export function useCountAnimation(target: number, duration = 2000) {
	const [count, setCount] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (!target) return;

		setIsAnimating(true);
		setCount(0);

		let animationFrameId: number;
		let startTime: number;

		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);
			const easeOutCubic = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(target * easeOutCubic));

			if (progress < 1) {
				animationFrameId = requestAnimationFrame(animate);
			} else {
				setIsAnimating(false);
			}
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [target, duration]);

	return { count, isAnimating };
}

import { useState, useEffect } from 'react';

/**
 * 숫자 카운트 애니메이션 훅
 * @param target 목표 숫자
 * @param duration 애니메이션 지속 시간 (ms)
 * @returns { count: number, isAnimating: boolean }
 */
export function useCountAnimation(target: number, duration = 2000) {
	const [count, setCount] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (!target) return;

		setIsAnimating(true);
		setCount(0);

		let startTime: number;
		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);
			const easeOutCubic = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(target * easeOutCubic));

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsAnimating(false);
			}
		};

		requestAnimationFrame(animate);
	}, [target, duration]);

	return { count, isAnimating };
}

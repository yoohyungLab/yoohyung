'use client';

import { useCallback, useRef, useState } from 'react';
import { useCountAnimation } from '@/shared/hooks';
import Image from 'next/image';
import { Button } from '@pickid/ui';
import { supabase } from '@pickid/supabase';
import { trackTestStart } from '@/shared/lib/analytics';
import { GenderSelectModal } from '../psychology/gender-select-modal';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../../lib/themes';

interface TestIntroProps {
	test: TestWithNestedDetails;
	onStart: (selectedGender?: 'male' | 'female') => void;
	theme: ColorTheme;
}

const COUNT_GRADIENTS = {
	purple: 'from-pink-500 to-amber-500',
	blue: 'from-blue-600 to-cyan-600',
	green: 'from-green-600 to-emerald-600',
	orange: 'from-orange-600 to-amber-600',
	red: 'from-red-600 to-rose-600',
} as const;

export function TestIntro({ test, onStart, theme }: TestIntroProps) {
	const [showGenderModal, setShowGenderModal] = useState(false);
	const isIncrementingRef = useRef(false);

	const testId = test?.test?.id as string;
	const testTitle = test?.test?.title as string;
	const requiresGender = test?.test?.requires_gender as boolean;
	const startCount = (test?.test?.start_count as number) || 0;

	const { count: animatedCount, isAnimating } = useCountAnimation(startCount, 800);

	const handleStartClick = useCallback(async () => {
		if (isIncrementingRef.current) return;
		isIncrementingRef.current = true;

		try {
			// UI 전환을 먼저 처리
			if (requiresGender) {
				setShowGenderModal(true);
			} else {
				onStart();
			}

			// 카운트 증가 및 트래킹은 비동기로 처리 (UI 블로킹 방지)
			Promise.resolve()
				.then(async () => {
					await supabase.rpc('increment_test_start', { test_uuid: testId });
					trackTestStart(testId, testTitle);
				})
				.catch((err) => console.warn('start side-effects failed', err));
		} finally {
			isIncrementingRef.current = false;
		}
	}, [testId, testTitle, requiresGender, onStart]);

	const handleGenderSelect = useCallback(
		(gender: 'male' | 'female') => {
			setShowGenderModal(false);
			onStart(gender);
		},
		[onStart]
	);

	const countGradient = COUNT_GRADIENTS[theme.name as keyof typeof COUNT_GRADIENTS] || COUNT_GRADIENTS.purple;

	return (
		<div className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-visible">
				{(test?.test?.thumbnail_url || '/images/placeholder.svg') && (
					<figure className="relative w-full aspect-square mb-6 rounded-3xl overflow-hidden shadow-xl">
						<Image
							src={(test.test.thumbnail_url as string) || '/images/placeholder.svg'}
							alt={(test?.test?.title as string) || '테스트'}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 420px"
							priority
						/>
					</figure>
				)}

				<header className="text-center mb-6">
					<h1 className="text-2xl font-black mb-4 text-gray-800 leading-tight">
						{(test?.test?.title as string) || '테스트'}
					</h1>
					{test?.test?.description && (
						<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
							{test.test.description as string}
						</p>
					)}
				</header>

				<section
					className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-5 mb-6 text-center relative overflow-hidden`}
				>
					<div className="flex items-baseline justify-center gap-2 mb-1">
						<span className="text-xs font-bold text-gray-600">지금까지</span>
						<span
							className={`text-3xl font-black bg-gradient-to-r ${countGradient} bg-clip-text text-transparent ${
								isAnimating ? 'animate-pulse' : ''
							}`}
						>
							{animatedCount.toLocaleString()}
						</span>
						<span className="text-xs font-bold text-gray-600">명</span>
					</div>
					<p className="text-xs font-bold text-gray-500">참여 중이에요!</p>
				</section>

				<Button
					onClick={handleStartClick}
					size="xl"
					className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black rounded-2xl hover:bg-right hover:animate-gradient transition-all duration-500 shadow-xl hover:shadow-2xl`}
					style={{
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
					}}
				>
					시작하기
				</Button>

				{showGenderModal && <GenderSelectModal onSelect={handleGenderSelect} />}
			</article>
		</div>
	);
}

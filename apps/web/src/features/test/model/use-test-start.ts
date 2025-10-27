'use client';

import { useCallback, useRef, useState } from 'react';

import { supabase } from '@pickid/supabase';
import { trackTestStart } from '@/shared/lib/analytics';

interface IUseTestStartProps {
	testId: string;
	testTitle?: string;
	requiresGender?: boolean;
}

export function useTestStart({ testId, testTitle, requiresGender }: IUseTestStartProps) {
	const [showGenderModal, setShowGenderModal] = useState(false);
	const isIncrementingRef = useRef(false);

	// 시작 횟수 증가
	const incrementStartCount = useCallback(async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await (supabase.rpc as any)('increment_test_start', { test_uuid: testId });
		} catch (err) {
			console.warn('Failed to increment start count:', err);
		}
	}, [testId]);

	// GA 이벤트 추적
	const trackStart = useCallback(() => {
		if (testId && testTitle) {
			trackTestStart(testId, testTitle);
		}
	}, [testId, testTitle]);

	// 테스트 시작 처리
	const handleStartTest = useCallback(
		async (onStart: (gender?: 'male' | 'female') => void) => {
			if (isIncrementingRef.current) return;
			isIncrementingRef.current = true;
			try {
				console.log('handleStartTest called:', { requiresGender, testId, testTitle });

				// UI 전환을 먼저 처리하여 체감 지연 제거
				if (requiresGender) {
					console.log('Showing gender modal');
					setShowGenderModal(true);
				} else {
					console.log('Starting test without gender');
					onStart();
				}

				// 카운트 증가 및 트래킹은 비동기로 처리 (UI 블로킹 방지)
				Promise.resolve()
					.then(async () => {
						await incrementStartCount();
						trackStart();
					})
					.catch((err) => console.warn('start side-effects failed', err));
			} finally {
				isIncrementingRef.current = false;
			}
		},
		[incrementStartCount, trackStart, requiresGender, testId, testTitle]
	);

	// 성별 선택 처리
	const handleGenderSelect = useCallback((gender: 'male' | 'female', onStart: (gender?: 'male' | 'female') => void) => {
		setShowGenderModal(false);
		onStart(gender);
	}, []);

	return {
		showGenderModal,
		handleStartTest,
		handleGenderSelect,
	};
}

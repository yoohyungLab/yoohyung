'use client';

import { useState, useRef, useCallback } from 'react';
import { supabase } from '@pickid/supabase';
import { trackTestStart } from '@/shared/lib/analytics';

interface IUseTestStartVMProps {
	testId: string;
	testTitle?: string;
	requiresGender?: boolean;
}

/**
 * 테스트 시작 ViewModel
 * 시작 횟수 증가 및 GA 이벤트 추적
 */
export function useTestStartVM({ testId, testTitle, requiresGender }: IUseTestStartVMProps) {
	const [showGenderModal, setShowGenderModal] = useState(false);
	const isIncrementingRef = useRef(false);

	// 시작 횟수 증가
	const incrementStartCount = useCallback(async () => {
		try {
			await supabase.rpc('increment_test_start', { test_uuid: testId });
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

			await incrementStartCount();
			trackStart();

			if (requiresGender) {
				setShowGenderModal(true);
			} else {
				onStart();
			}
		},
		[incrementStartCount, trackStart, requiresGender]
	);

	// 성별 선택 처리
	const handleGenderSelect = useCallback(
		(gender: 'male' | 'female', onStart: (gender?: 'male' | 'female') => void) => {
			setShowGenderModal(false);
			onStart(gender);
		},
		[]
	);

	return {
		showGenderModal,
		handleStartTest,
		handleGenderSelect,
	};
}


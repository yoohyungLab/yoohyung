'use client';

import { useMemo, useState } from 'react';

export interface ISimpleTestProgress {
	currentQuestionIndex: number;
	totalQuestions: number;
	isCompleted: boolean;
}

export function useTestProgress(total: number) {
	const [current, setCurrent] = useState(0);
	const progress = useMemo<ISimpleTestProgress>(
		() => ({ currentQuestionIndex: current, totalQuestions: total, isCompleted: current >= total }),
		[current, total]
	);
	const next = () => setCurrent((c) => Math.min(total, c + 1));
	const prev = () => setCurrent((c) => Math.max(0, c - 1));
	const reset = () => setCurrent(0);
	return { progress, next, prev, reset, setCurrent } as const;
}

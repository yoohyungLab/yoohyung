'use client';

import { useCallback } from 'react';

export function useAnswerSubmit(onSubmit: (choiceId: string) => void) {
	const submit = useCallback((choiceId: string) => onSubmit(choiceId), [onSubmit]);
	return { submit } as const;
}


'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';

export function useToast() {
	const toastVariables = useMemo(
		() => ({
			success: (message: string) => {
				toast.success(message);
			},
			error: (message: string) => {
				toast.error(message);
			},
			info: (message: string) => {
				toast.info(message);
			},
		}),
		[]
	);

	return toastVariables;
}

// 공유 성공 토스트 훅
export function useShareToast() {
	const showShareSuccessToast = () => {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		const message = isMobile
			? '공유 완료! 친구와 함께 비교해보세요 🎉'
			: '링크가 복사되었습니다! 친구에게 공유해보세요';

		toast.success(message);
	};

	return { showShareSuccessToast };
}

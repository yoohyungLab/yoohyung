'use client';

import { useState } from 'react';
import { trackResultShared } from '@/shared/lib/analytics';

interface UseTestResultShareProps {
	testId: string;
	resultName: string;
}

export function useTestResultShare({ testId, resultName }: UseTestResultShareProps) {
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	const handleShare = async () => {
		const shareText = `나의 결과는 "${resultName}"이에요! 당신도 테스트해보세요 ✨\n\n${window.location.origin}/tests/${testId}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: resultName,
					text: shareText,
					url: `${window.location.origin}/tests/${testId}`,
				});
				trackResultShared('native', testId, resultName);
			} catch {
				// 공유가 취소됨
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				alert('링크가 클립보드에 복사되었습니다!');
				trackResultShared('clipboard', testId, resultName);
			} catch {
				setIsShareModalOpen(true);
			}
		}
	};

	return {
		isShareModalOpen,
		setIsShareModalOpen,
		handleShare,
	};
}

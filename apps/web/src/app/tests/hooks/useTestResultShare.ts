'use client';

import { SITE_CONFIG } from '@/components/config/metadata';
import { trackResultShared } from '@/lib/analytics';

interface UseTestResultShareProps {
	testId: string;
	resultName: string;
}

export function useTestResultShare({ testId, resultName }: UseTestResultShareProps) {
	const handleShare = async () => {
		const shareUrl = `${SITE_CONFIG.url}/tests/${testId}`;
		const shareText = `나의 결과는 "${resultName}"이에요! 당신도 테스트해보세요 ✨\n\n${shareUrl}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: resultName,
					text: shareText,
					url: shareUrl,
				});
				trackResultShared('native', testId, resultName);
			} catch {
				// 사용자가 공유를 취소함
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				alert('링크가 클립보드에 복사되었습니다!');
				trackResultShared('clipboard', testId, resultName);
			} catch (error) {
				console.error('클립보드 복사 실패:', error);
				alert('링크 복사에 실패했습니다. 다시 시도해주세요.');
			}
		}
	};

	return { handleShare };
}

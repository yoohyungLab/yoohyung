'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, RotateCcw, Home, Play } from 'lucide-react';
import { Button } from '@pickid/ui';
import { useShareToast } from '@pickid/shared';
import { SITE_CONFIG } from '@/constants/site-config';

interface TestCTAButtonsProps {
	testId: string;
	mode: 'result' | 'shared'; // 본인 결과 vs 공유 결과
	onShare?: () => void;
	resultName?: string;
	userName?: string;
	isBalanceGame?: boolean; // 밸런스게임 여부
	className?: string;
}

export function TestCTAButtons(props: TestCTAButtonsProps) {
	const { testId, mode, onShare, resultName, userName, isBalanceGame = false, className = '' } = props;
	const router = useRouter();
	const { showShareSuccessToast } = useShareToast();

	// 다시하기/테스트하기 핸들러
	const handleTest = useCallback(() => {
		router.push(`/tests/${testId}`);
	}, [router, testId]);

	// 공유 핸들러
	const handleShare = useCallback(async () => {
		// 밸런스게임은 테스트 페이지로, 일반 테스트는 결과 페이지로 공유
		const shareUrl = isBalanceGame
			? `${SITE_CONFIG.url}/tests/${testId}?ref=share`
			: `${SITE_CONFIG.url}/tests/${testId}/result?ref=share`;

		const displayName = userName || '친구';
		const shareTitle = `${displayName}님의 ${resultName || '테스트'} 결과`;
		const shareText = `${displayName}님이 테스트를 완료했어요!\n\n"${
			resultName || '테스트 결과'
		}"\n\n나도 테스트해보기: ${shareUrl}`;

		// 모바일에서는 시스템 공유 우선 사용
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (isMobile && navigator.share) {
			try {
				await navigator.share({
					title: shareTitle,
					text: shareText,
					url: shareUrl,
				});

				showShareSuccessToast();
				return;
			} catch (error) {
				// 사용자가 취소한 경우는 무시
				if (error instanceof Error && error.name === 'AbortError') {
					return;
				}
				console.error('공유 실패:', error);
			}
		}

		// PC 또는 모바일에서 네이티브 공유가 실패한 경우 클립보드 복사
		try {
			await navigator.clipboard.writeText(shareUrl);
			showShareSuccessToast();
		} catch {
			// 클립보드 API가 없으면 기존 모달 열기
			onShare?.();
		}
	}, [testId, resultName, userName, isBalanceGame, onShare, showShareSuccessToast]);

	// 홈 핸들러
	const handleHome = useCallback(() => {
		router.push('/');
	}, [router]);

	// 본인 결과 페이지 (다시하기 + 공유하기 + 홈)
	if (mode === 'result') {
		return (
			<div className={`space-y-4 pb-8 ${className}`}>
				{/* 주요 액션 */}
				<div className="grid grid-cols-2 gap-3">
					<Button
						onClick={handleTest}
						size="xl"
						className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-[length:200%_100%] hover:bg-right text-white font-black text-[15px] py-4 px-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
					>
						<RotateCcw className="w-5 h-5 mr-2" />
						다시하기
					</Button>
					<Button
						onClick={handleShare}
						size="xl"
						className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-[length:200%_100%] hover:bg-right text-white font-black text-[15px] py-4 px-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
					>
						<Share2 className="w-5 h-5 mr-2" />
						공유하기
					</Button>
				</div>

				{/* 홈 버튼 */}
				<Button
					onClick={handleHome}
					size="xl"
					variant="outline"
					className="w-full px-5 rounded-2xl font-black text-[15px] shadow-lg hover:shadow-xl bg-white border-gray-300 text-gray-800 hover:bg-gray-50 py-3.5 transition-all duration-500"
				>
					<Home className="w-5 h-5 mr-2" />
					다른 테스트 하러가기
				</Button>
			</div>
		);
	}

	// 공유 결과 페이지 (나도 테스트하기 + 홈)
	return (
		<div className={`space-y-4 pb-8 ${className}`}>
			{/* 주요 액션 */}
			<div className="grid grid-cols-2 gap-3">
				<Button
					onClick={handleTest}
					size="xl"
					className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-[length:200%_100%] hover:bg-right text-white font-black text-[15px] py-4 px-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
				>
					<Play className="w-5 h-5 mr-2" />
					나도 테스트하기
				</Button>
				<Button
					onClick={handleHome}
					variant="outline"
					size="xl"
					className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50 font-black text-[15px] py-4 px-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
				>
					<Home className="w-5 h-5 mr-2" />
					다른 테스트 하러가기
				</Button>
			</div>
		</div>
	);
}

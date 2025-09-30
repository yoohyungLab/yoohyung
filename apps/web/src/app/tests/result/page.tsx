'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ResultDetails, ResultComparisonSection, ResultCtaSection, ShareModal } from '@/entities/test-result';
import { EGEN_TETO_RESULTS } from '@/shared/constants';
import { TestResult } from '@/shared/types';
import { trackResultViewed, trackResultShared, trackCtaClicked } from '@/shared/lib/analytics';

function ResultPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const resultType = searchParams.get('type') as TestResult | null;
	// const isShared = searchParams.get('shared') === 'true'

	// 세션 스토리지에서 결과 데이터 가져오기
	const getResultData = () => {
		if (typeof window === 'undefined') return null;
		const storedData = sessionStorage.getItem('testResult');
		if (storedData) {
			try {
				return JSON.parse(storedData);
			} catch (error) {
				console.error('Failed to parse stored result data:', error);
				return null;
			}
		}
		return null;
	};

	const resultDataFromStorage = getResultData();
	const scoreParam = resultDataFromStorage?.score;
	const genderParam = resultDataFromStorage?.gender as 'male' | 'female' | null;

	const isValid = resultType && EGEN_TETO_RESULTS[resultType] && scoreParam !== null && genderParam;

	// 로그인 상태 확인 (실제로는 인증 상태를 확인해야 함)
	useEffect(() => {
		if (typeof window === 'undefined') return;
		// 임시로 로컬 스토리지에서 로그인 상태 확인
		const authToken = localStorage.getItem('authToken');
		setIsLoggedIn(!!authToken);
	}, []);

	// 유효하지 않은 결과인 경우 리다이렉트
	useEffect(() => {
		if (!isValid) {
			router.push('/tests/egen-teto');
		}
	}, [isValid, router]);

	// 페이지 뷰 트래킹
	useEffect(() => {
		if (resultType) {
			trackResultViewed('egen-teto', resultType, isLoggedIn);
		}
	}, [resultType, isLoggedIn]);

	if (!isValid) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">결과를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	const data = EGEN_TETO_RESULTS[resultType];
	const totalScore = parseInt(scoreParam, 10);
	const egenPct = totalScore;
	const tetoPct = 100 - totalScore;
	// const bgImage = EGEN_TETO_RESULT_BG_IMAGES[resultType] || '/images/egen-teto/bg-mixed.jpg'

	// 이벤트 핸들러들
	const handleShare = () => {
		setIsShareModalOpen(true);
		trackResultShared('modal_opened', 'egen-teto', resultType);
	};

	const handleSave = () => {
		if (isLoggedIn) {
			// 로그인된 사용자: 마이페이지로 이동
			router.push('/mypage');
		} else {
			// 비로그인 사용자: 이메일 입력 모달 또는 가입 페이지로 이동
			router.push('/auth/signup?redirect=/tests/result');
		}
		trackCtaClicked('save', 'egen-teto');
	};

	const handleSignUp = () => {
		router.push('/auth/signup?redirect=/tests/result');
		trackCtaClicked('signup', 'egen-teto');
	};

	const handleSubscribe = () => {
		// 알림 구독 로직
		console.log('알림 구독 요청');
		trackCtaClicked('subscribe', 'egen-teto');
	};

	const handleRestart = () => {
		if (typeof window !== 'undefined') {
			sessionStorage.removeItem('testResult');
		}
		router.push('/tests/egen-teto');
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 헤더 */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={() => router.push('/')}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							<span className="text-2xl">🏠</span>
							<Image src="/icons/logo.svg" alt="픽키드" width={24} height={24} />
						</button>
						<div className="flex items-center gap-3">
							<button onClick={handleRestart} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
								다시 테스트하기
							</button>
							<button
								onClick={handleShare}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
							>
								공유하기
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* 메인 콘텐츠 */}
			<main className="max-w-4xl mx-auto px-4 py-8">
				<div className="space-y-8">
					{/* 상세 해석 섹션 */}
					<ResultDetails egenPct={egenPct} tetoPct={tetoPct} characteristics={data.characteristics} />

					{/* 비교/컨텍스트 섹션 */}
					<ResultComparisonSection totalScore={totalScore} resultType={resultType} />

					{/* CTA 섹션 */}
					<ResultCtaSection
						resultType={resultType}
						totalScore={totalScore}
						isLoggedIn={isLoggedIn}
						onShare={handleShare}
						onSave={handleSave}
						onSignUp={handleSignUp}
						onSubscribe={handleSubscribe}
					/>
				</div>
			</main>

			{/* 공유 모달 */}
			<ShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				resultType={resultType}
				totalScore={totalScore}
				title={data.title}
				description={data.description}
				emoji={data.emoji}
			/>

			{/* 하단 네비게이션 (모바일) */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
				<div className="flex gap-3">
					<button
						onClick={handleShare}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
					>
						공유하기
					</button>
					<button
						onClick={handleSave}
						className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
					>
						{isLoggedIn ? '저장됨' : '저장하기'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ResultPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">결과를 불러오는 중...</p>
					</div>
				</div>
			}
		>
			<ResultPageContent />
		</Suspense>
	);
}

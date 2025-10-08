'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { TestResultShareModal } from '@/shared/components/test-result-share-modal';
import { trackResultViewed, trackResultShared } from '@/shared/lib/analytics';
import { supabase } from '@pickid/shared';
import type { TestResult, UserTestResponse } from '@pickid/supabase';

function ResultPageContent() {
	const router = useRouter();
	const params = useParams();
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	const testId = params?.id as string;

	useEffect(() => {
		const loadResultData = async () => {
			if (!testId) {
				setError('테스트 ID가 없습니다.');
				setIsLoading(false);
				return;
			}

			try {
				let responseData: UserTestResponse | null = null;
				let totalScore = 0;

				if (typeof window !== 'undefined') {
					const storedData = sessionStorage.getItem('testResult');
					if (storedData) {
						try {
							const parsedData = JSON.parse(storedData);
							if (parsedData.testId === testId && parsedData.resultId !== 'temp') {
								responseData = parsedData;
								totalScore = parsedData.totalScore || 0;
							}
						} catch (err) {
							console.warn('Failed to parse stored result data:', err);
						}
					}
				}

				if (!responseData) {
					const { data: userResponses } = await supabase
						.from('user_test_responses')
						.select('*')
						.eq('test_id', testId)
						.order('completed_at', { ascending: false })
						.limit(1);

					if (userResponses && userResponses.length > 0) {
						responseData = userResponses[0];
						totalScore = userResponses[0].total_score || 0;
					}
				}

				setTotalScore(totalScore);

				const { data: results, error: resultsError } = await supabase
					.from('test_results')
					.select('*')
					.eq('test_id', testId)
					.order('result_order');

				if (resultsError) {
					setError('테스트 결과를 찾을 수 없습니다.');
					setIsLoading(false);
					return;
				}

				let matchingResult = null;

				if (
					responseData &&
					'resultName' in responseData &&
					responseData.resultName &&
					responseData.result_id !== 'temp'
				) {
					const sessionData = responseData as UserTestResponse & {
						resultName: string;
						result_id: string;
						description: string;
						features: Record<string, unknown>;
						theme_color: string;
						background_image_url: string;
					};
					matchingResult = {
						id: sessionData.result_id,
						result_name: sessionData.resultName,
						description: sessionData.description,
						features: sessionData.features || {},
						theme_color: sessionData.theme_color || '#3B82F6',
						background_image_url: sessionData.background_image_url,
					};
				} else {
					for (const result of results) {
						if (result.match_conditions) {
							const conditions = result.match_conditions as {
								min?: number;
								max?: number;
								min_score?: number;
								max_score?: number;
							};
							const minScore = conditions.min || conditions.min_score || 0;
							const maxScore = conditions.max || conditions.max_score || 999999;

							if (totalScore >= minScore && totalScore <= maxScore) {
								matchingResult = result;
								break;
							}
						}
					}

					if (!matchingResult && results.length > 0) {
						matchingResult = results[0];
					}
				}

				if (!matchingResult) {
					setError('테스트 결과를 찾을 수 없습니다.');
					setIsLoading(false);
					return;
				}

				setTestResult(matchingResult);
				setIsLoggedIn(!!localStorage.getItem('authToken'));
				setIsLoading(false);
			} catch (err) {
				console.error('Error loading result data:', err);
				setError('결과를 불러오는 중 오류가 발생했습니다.');
				setIsLoading(false);
			}
		};

		loadResultData();
	}, [testId]);

	useEffect(() => {
		if (testResult) {
			trackResultViewed(testId || '', testResult.result_name, isLoggedIn);
		}
	}, [testResult, testId, isLoggedIn]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
			</div>
		);
	}

	// TODO: 잘못된 접근일 경우 notFound 페이지로 이동
	if (error || !testResult) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 flex items-center justify-center p-4">
				<div className="text-center">
					<p className="text-lg font-semibold text-gray-900 mb-4">잘못된 접근입니다</p>
					<button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
						홈으로 돌아가기
					</button>
				</div>
			</div>
		);
	}

	const features = testResult.features as Record<string, string[]>;

	const handleShare = async () => {
		const shareText = `나의 결과는 "${testResult.result_name}"이에요! 당신도 테스트해보세요 ✨\n\n${window.location.origin}/tests/${testId}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: testResult.result_name,
					text: shareText,
					url: `${window.location.origin}/tests/${testId}`,
				});
				trackResultShared('native', testId, testResult.result_name);
			} catch {
				console.log('공유가 취소되었습니다.');
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				alert('링크가 클립보드에 복사되었습니다!');
				trackResultShared('clipboard', testId, testResult.result_name);
			} catch {
				setIsShareModalOpen(true);
			}
		}
	};

	return (
		<div className="min-h-screen font-sans bg-gradient-to-b from-sky-50 via-white to-blue-100">
			{/* 배경 이미지 헤더 */}
			<div className="relative w-full">
				{testResult.background_image_url ? (
					<>
						<div className="w-full aspect-[4/3] relative">
							<Image src={testResult.background_image_url} alt="결과 배경" fill className="object-cover" />
						</div>
						<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-white/60 to-white" />
					</>
				) : (
					<div
						className="w-full aspect-[4/3]"
						style={{
							background: `linear-gradient(to bottom, ${testResult.theme_color}20, transparent)`,
						}}
					/>
				)}
			</div>

			{/* 메인 콘텐츠 */}
			<div className="max-w-md mx-auto px-5 -mt-24 pb-24 relative z-10">
				{/* 결과 타이틀 */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-3 drop-shadow-sm" style={{ color: testResult.theme_color || '#3B82F6' }}>
						{testResult.result_name}
					</h1>
					<p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
						{testResult.description}
					</p>
				</div>

				{/* 특징 섹션 */}
				{features && Object.keys(features).length > 0 && (
					<div className="space-y-4">
						{Object.entries(features).map(([key, values], idx) => (
							<div key={idx} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
								<h3 className="font-semibold text-gray-900 text-base mb-3">{key}</h3>
								<ul className="text-gray-700 space-y-2 text-sm">
									{values.map((value, i) => (
										<li
											key={i}
											className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-400"
										>
											{value}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}

				{/* 액션 버튼 */}
				<div className="pt-8 flex gap-3">
					<button
						onClick={() => router.push(`/tests/${testId}`)}
						className="flex-1 text-sm py-3 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
					>
						다시 테스트하기
					</button>
					<button
						onClick={handleShare}
						className="flex-1 text-sm py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium flex items-center justify-center gap-2 transition-all"
					>
						<Share2 className="w-4 h-4" />
						공유하기
					</button>
				</div>
			</div>

			{/* 공유 모달 */}
			<TestResultShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				resultType={testResult.result_name || ''}
				totalScore={totalScore}
				title={testResult.result_name || ''}
				description={testResult.description || ''}
				emoji="✨"
			/>
		</div>
	);
}

export default function TestResultPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 flex items-center justify-center">
					<div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
				</div>
			}
		>
			<ResultPageContent />
		</Suspense>
	);
}

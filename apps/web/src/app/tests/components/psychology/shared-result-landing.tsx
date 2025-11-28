'use client';

import { useState, useEffect } from 'react';
import type { TestResult } from '@pickid/supabase';
import { testResultService } from '@/api/services/test-result.service';
import { adjustColor } from '@/lib/color-utils';
import { Loading } from '@/components/loading';
import { TestCTAButtons } from '../shared/test-cta-buttons';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';

interface SharedResultLandingProps {
	testId: string;
}

export function SharedResultLanding(props: SharedResultLandingProps) {
	const { testId } = props;
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadRepresentativeResult() {
			try {
				// 테스트의 첫 번째 결과를 대표 결과로 사용
				const results = await testResultService.getTestResultsByTestId(testId);
				if (results && results.length > 0) {
					setTestResult(results[0]);
				}
			} catch (error) {
				console.error('대표 결과 로드 실패:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadRepresentativeResult();
	}, [testId]);

	if (isLoading) {
		return <Loading variant="result" />;
	}

	if (!testResult) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-600">결과를 불러올 수 없습니다.</p>
			</div>
		);
	}

	const themeColor = testResult.theme_color || '#3B82F6';

	return (
		<div
			className="relative min-h-screen font-sans pt-6 pb-8"
			style={{
				background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}05 50%, ${themeColor}10 100%)`,
			}}
		>
			<div className="relative z-10">
				<div className="max-w-lg mx-auto px-5 mb-6">
					<div className="text-center">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
							<h1 className="text-lg font-black text-gray-900 mb-3 leading-relaxed">친구는</h1>
							<div
								className="inline-block px-4 py-2 rounded-2xl text-white font-black text-sm leading-tight mb-3 max-w-full break-words"
								style={{
									background: `linear-gradient(135deg, ${themeColor as string} 0%, ${adjustColor(themeColor as string, -0.2)} 100%)`,
									boxShadow: `0 4px 12px ${themeColor as string}40`,
								}}
							>
								{testResult.result_name as string}
							</div>
							<h2 className="text-lg font-black text-gray-900 leading-relaxed">이에요!</h2>
							<p className="text-gray-600 text-sm font-medium mt-3">당신은 어떤 유형일까요? 🎯</p>
						</div>
					</div>
				</div>

				<div className="opacity-80 pointer-events-none">
					<TestResultHeader testResult={testResult} />
					<TestResultContent testResult={testResult} />
				</div>

				<div className="max-w-md mx-auto px-5 mt-8">
					<TestCTAButtons testId={testId} mode="shared" isBalanceGame={false} />
				</div>
			</div>
		</div>
	);
}

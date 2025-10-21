'use client';

import type { TestResult } from '@pickid/supabase';
import { adjustColor } from '@/shared/lib/color-utils';
import { TestCTAButtons } from './test-cta-buttons';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';

interface SharedResultLandingProps {
	testResult: TestResult;
	testId: string;
}

export function SharedResultLanding(props: SharedResultLandingProps) {
	const { testResult, testId } = props;
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
									background: `linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, -0.2)} 100%)`,
									boxShadow: `0 4px 12px ${themeColor}40`,
								}}
							>
								{testResult.result_name}
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

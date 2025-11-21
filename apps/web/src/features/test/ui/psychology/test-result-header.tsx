'use client';

import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	const themeColor = testResult.theme_color || '#3B82F6';

	return (
		<div className="w-full px-5 pt-6 pb-4">
			<div className="max-w-sm mx-auto">
				<div className="bg-white rounded-2xl shadow-lg border border-gray-100">
					{testResult.background_image_url && (
						<div className="relative w-full flex items-center justify-center pt-6 pb-4 px-4">
							<div className="relative w-full max-w-[240px]">
								<Image
									src={testResult.background_image_url}
									alt="결과 이미지"
									width={240}
									height={240}
									className="w-full h-auto object-contain"
									sizes="240px"
									priority={true}
									quality={85}
								/>
							</div>
						</div>
					)}

					{/* 타이틀 영역 */}
					<div className="px-5 pb-6">
						{/* 타이틀 */}
						<h1
							className="text-xl font-bold text-center leading-snug mb-3"
							style={{
								color: themeColor,
							}}
						>
							{testResult.result_name}
						</h1>

						{/* 설명 */}
						{testResult.description && (
							<p className="text-sm text-gray-600 text-center leading-relaxed">
								{(testResult.description as string).split('\n')[0]}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';
import { hexToRgba, adjustColor } from '@/shared/lib/color-utils';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	const themeColor = testResult.theme_color || '#3B82F6';

	return (
		<div className="relative w-full mb-8 overflow-hidden">
			{/* 배경 이미지 */}
			{testResult.background_image_url ? (
				<div className="w-full min-h-[380px] max-h-[550px] relative">
					<Image
						src={testResult.background_image_url}
						alt="결과 배경"
						fill
						className="object-contain"
						sizes="100vw"
						priority={true}
						quality={90}
					/>
				</div>
			) : (
				<div className="w-full min-h-[380px] relative" />
			)}

			{/* Result Name - 이미지 하단에 겹치게 배치 */}
			<div className="relative -mt-16 px-5">
				<div className="max-w-lg mx-auto">
					{/* 타이틀 카드 */}
					<div className="relative bg-white rounded-2xl px-6 py-6 border border-gray-200 shadow-sm">
						{/* 타이틀 */}
						<h1
							className="text-[22px] font-extrabold text-center leading-tight tracking-tight title-font"
							style={{
								background: `linear-gradient(180deg, 
									#ffffff 0%, 
									#ffffff 35%, 
									${hexToRgba(themeColor, 0.6)} 70%, 
									${themeColor} 100%
								)`,
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								WebkitTextStroke: `0.8px ${adjustColor(themeColor, -0.1)}`,
								textShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
							}}
						>
							{testResult.result_name}
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}

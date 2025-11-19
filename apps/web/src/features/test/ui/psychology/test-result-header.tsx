'use client';

import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';
import { hexToRgba } from '@/shared/lib/color-utils';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	const themeColor = testResult.theme_color || '#3B82F6';

	return (
		<div className="relative w-full mb-8 overflow-hidden">
			{testResult.background_image_url ? (
				<div className="w-full min-h-[380px] max-h-[550px] relative">
					<Image
						src={testResult.background_image_url}
						alt="결과 배경"
						fill
						className="object-cover"
						sizes="100vw"
						priority={true}
						quality={90}
					/>
					<div
						className="absolute bottom-0 left-0 right-0 h-48"
						style={{
							background: `linear-gradient(180deg, ${hexToRgba('#ffffff', 0)} 0%, ${hexToRgba('#ffffff', 0.2)} 40%, ${hexToRgba('#ffffff', 1)} 100%)`,
						}}
					/>
				</div>
			) : (
				<div className="w-full min-h-[380px] relative" />
			)}

			<div className="relative -mt-12 px-5">
				<div className="max-w-lg mx-auto">
					<h1
						className="text-[28px] font-extrabold text-center leading-tight tracking-tight"
						style={{
							backgroundImage: `linear-gradient(90deg, ${themeColor} 0%, ${hexToRgba(themeColor, 0.7)} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							WebkitTextStroke: `1.5px ${hexToRgba(themeColor, 0.4)}`,
							textShadow: `1px 1px 0 ${hexToRgba(themeColor, 0.15)}, -1px -1px 0 ${hexToRgba(themeColor, 0.15)}`,
						}}
					>
						{testResult.result_name}
					</h1>
				</div>
			</div>
		</div>
	);
}

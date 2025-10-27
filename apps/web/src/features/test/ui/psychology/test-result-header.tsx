import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';
import { hexToRgba } from '@/shared/lib/color-utils';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	return (
		<div className="relative w-full mb-8 overflow-hidden">
			{/* 배경 이미지 (전체 채우기) */}
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
					{/* 하단 그라데이션 오버레이 (투명 -> 배경) */}
					<div
						className="absolute bottom-0 left-0 right-0 h-32"
						style={{
							background: `linear-gradient(180deg, ${hexToRgba('#ffffff', 0)} 0%, ${hexToRgba('#ffffff', 1)} 100%)`,
						}}
					/>
				</div>
			) : (
				<div className="w-full min-h-[380px] relative" />
			)}

			{/* 결과명 - 카드/패딩 제거, 28px, 스트로크/섀도 제거 */}
			<div className="relative -mt-12 px-5">
				<div className="max-w-lg mx-auto">
					<h1 className="text-[28px] font-extrabold text-center leading-tight tracking-tight text-gray-900">
						{testResult.result_name}
					</h1>
				</div>
			</div>
		</div>
	);
}

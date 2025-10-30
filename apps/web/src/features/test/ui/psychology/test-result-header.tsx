'use client';

import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';
import { hexToRgba } from '@/shared/lib/color-utils';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	const themeColor = testResult.theme_color || '#3B82F6';
	const fadeOutColor = '#ffffff'; // 배경이 흰색이므로 페이드 아웃 색상은 흰색

	// 텍스트 스트로크를 위한 밝고 연한 색상 정의
	// (themeColor를 50% 투명도로 설정하여 더 연하게 만듭니다. 필요에 따라 연한 회색을 섞을 수도 있습니다)
	const strokeColor = hexToRgba(themeColor, 0.4); // themeColor를 40% 투명도로 사용하여 연한 스트로크

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
					{/* 1. 하단 그라데이션 오버레이 강화 (이미지가 배경색으로 사라지는 느낌) */}
					{/* 높이를 h-48(약 192px)로 더 늘려 페이드 아웃 영역을 넓히고, 투명도 변화를 부드럽게 조정 */}
					<div
						className="absolute bottom-0 left-0 right-0 h-48"
						style={{
							// 투명(0%)에서 최종 배경색(100%)으로 부드럽게 변화
							background: `linear-gradient(180deg, ${hexToRgba(fadeOutColor, 0)} 0%, ${hexToRgba(
								fadeOutColor,
								0.2
							)} 40%, ${hexToRgba(fadeOutColor, 1)} 100%)`,
						}}
					/>
				</div>
			) : (
				<div className="w-full min-h-[380px] relative" />
			)}

			{/* 결과명 - 중앙 정렬 유지 */}
			<div className="relative -mt-12 px-5">
				<div className="max-w-lg mx-auto">
					<h1
						className="text-[28px] font-extrabold text-center leading-tight tracking-tight"
						style={{
							// 텍스트 그라데이션 유지 (진한 색)
							backgroundImage: `linear-gradient(90deg, ${themeColor} 0%, ${hexToRgba(themeColor, 0.7)} 100%)`, // 그라데이션 방향을 바꿔 진하게 시작
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',

							// 2. 텍스트 스트로크 적용 (themeColor보다 연한 색상)
							WebkitTextStroke: `1.5px ${strokeColor}`, // 연한 strokeColor 사용
							textShadow: `
                1px 1px 0 ${hexToRgba(themeColor, 0.15)}, 
                -1px -1px 0 ${hexToRgba(themeColor, 0.15)}
              `, // 입체감을 위한 은은한 그림자
						}}
					>
						{testResult.result_name}
					</h1>
				</div>
			</div>
		</div>
	);
}

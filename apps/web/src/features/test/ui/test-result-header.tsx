import Image from 'next/image';
import type { TestResult } from '@pickid/supabase';

interface TestResultHeaderProps {
	testResult: TestResult;
}

export function TestResultHeader({ testResult }: TestResultHeaderProps) {
	return (
		<div className="relative w-full mb-8 overflow-hidden">
			{/* 배경 이미지 - 그라데이션 제거 */}
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
					{/* 메인 타이틀 영역 */}
					<div className="relative">
						{/* 타이틀 카드 */}
						<div
							className="relative px-7 py-6 overflow-hidden"
							style={{
								background: `linear-gradient(135deg, 
									rgba(255, 255, 255, 0.95) 0%, 
									rgba(255, 255, 255, 0.98) 50%,
									rgba(255, 255, 255, 0.95) 100%)`,
								borderRadius: '24px',
								boxShadow: `
									0 12px 32px rgba(0, 0, 0, 0.12),
									0 4px 16px rgba(0, 0, 0, 0.08),
									inset 0 0 0 2px ${testResult.theme_color}30,
									inset 0 0 20px ${testResult.theme_color}08
								`,
								border: `1px solid ${testResult.theme_color}20`,
							}}
						>
							{/* 배경 장식 - 작은 원들 */}
							<div
								className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-6"
								style={{
									background: `radial-gradient(circle, ${testResult.theme_color}30 0%, transparent 70%)`,
								}}
							/>
							<div
								className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-6"
								style={{
									background: `radial-gradient(circle, ${testResult.theme_color}30 0%, transparent 70%)`,
								}}
							/>

							{/* 타이틀 */}
							<h1
								className="relative text-[24px] font-black text-center leading-tight tracking-tight px-2"
								style={{
									color: testResult.theme_color || '#3B82F6',
									textShadow: `
										-1px -1px 0 #fff,
										1px -1px 0 #fff,
										-1px 1px 0 #fff,
										1px 1px 0 #fff,
										0 0 6px rgba(0, 0, 0, 0.1)
									`,
									WebkitTextStroke: `0.5px rgba(255, 255, 255, 0.8)`,
									paintOrder: 'stroke fill',
								}}
							>
								{testResult.result_name}
							</h1>

							{/* 하단 장식 */}
							<div className="flex items-center justify-center gap-2 mt-3">
								{/* 별 */}
								<svg
									className="w-3 h-3"
									fill="currentColor"
									style={{ color: testResult.theme_color || '#3B82F6' }}
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>

								{/* 라인 */}
								<div
									className="h-0.5 w-8 rounded-full"
									style={{
										background: `linear-gradient(90deg, transparent, ${testResult.theme_color}, transparent)`,
									}}
								/>

								{/* 하트 */}
								<svg
									className="w-3 h-3"
									fill="currentColor"
									style={{ color: testResult.theme_color || '#3B82F6' }}
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
										clipRule="evenodd"
									/>
								</svg>

								{/* 라인 */}
								<div
									className="h-0.5 w-8 rounded-full"
									style={{
										background: `linear-gradient(90deg, transparent, ${testResult.theme_color}, transparent)`,
									}}
								/>

								{/* 별 */}
								<svg
									className="w-3 h-3"
									fill="currentColor"
									style={{ color: testResult.theme_color || '#3B82F6' }}
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

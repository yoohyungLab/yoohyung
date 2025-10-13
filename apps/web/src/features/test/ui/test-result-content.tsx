import type { TestResult } from '@pickid/supabase';
import { Heart, Users, Briefcase, AlertCircle, TrendingUp } from 'lucide-react';

interface TestResultContentProps {
	testResult: TestResult;
}

export function TestResultContent({ testResult }: TestResultContentProps) {
	const features = testResult.features as Record<string, string[] | string>;

	// Description 파싱
	const parseDescription = (desc: string) => {
		const lines = desc.split('\n').filter((line) => line.trim());

		const summaryLines: string[] = [];
		const detailLines: { key: string; value: string }[] = [];

		lines.forEach((line) => {
			if (line.startsWith('•')) {
				const match = line.match(/^•\s*([^:]+):\s*(.+)$/);
				if (match) {
					detailLines.push({ key: match[1].trim(), value: match[2].trim() });
				}
			} else if (detailLines.length === 0) {
				summaryLines.push(line);
			}
		});

		return { summaryLines, detailLines };
	};

	const { summaryLines, detailLines } = parseDescription(testResult.description || '');

	// 선물 파싱 함수
	const parseGifts = (giftString: string): string[] => {
		return giftString
			.split(',')
			.map((gift) => gift.trim())
			.filter((gift) => gift.length > 0);
	};

	// hex to rgba 변환
	const hexToRgba = (hex: string, alpha: number) => {
		const cleanHex = hex.replace('#', '');
		const r = parseInt(cleanHex.substr(0, 2), 16);
		const g = parseInt(cleanHex.substr(2, 2), 16);
		const b = parseInt(cleanHex.substr(4, 2), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	// Theme 색상
	const getThemedColors = (baseColor: string) => {
		const hex = baseColor.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		return {
			surface: `${baseColor}08`,
			border: `${baseColor}15`,
			dot: baseColor,
			pastelBg: `rgba(${r}, ${g}, ${b}, 0.12)`,
			pastelText: `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, 1)`,
		};
	};

	const colors = getThemedColors(testResult.theme_color || '#3B82F6');

	// 아이콘 매핑
	const getIcon = (key: string) => {
		const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
			성향: Heart,
			관계: Users,
			'일/팀': Briefcase,
			일: Briefcase,
			팀: Users,
			주의: AlertCircle,
			성장: TrendingUp,
		};
		return iconMap[key] || Heart;
	};

	return (
		<div className="max-w-lg mx-auto px-5 pb-20">
			{/* Description */}
			<div
				className="relative rounded-2xl p-6 mb-6 overflow-hidden"
				style={{
					background: `linear-gradient(135deg, ${hexToRgba(testResult.theme_color || '#3B82F6', 0.08)} 0%, white 100%)`,
					border: `1px solid ${colors.border}`,
					boxShadow: `
						0 6px 20px rgba(0, 0, 0, 0.08),
						inset 0 1px 2px rgba(255, 255, 255, 0.5)
					`,
				}}
			>
				{/* 배경 장식 */}
				<div
					className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-6"
					style={{
						background: `radial-gradient(circle, ${testResult.theme_color}20 0%, transparent 70%)`,
					}}
				/>

				<div className="relative space-y-3">
					{summaryLines.map((line, idx) => (
						<p key={idx} className="text-[15px] text-gray-800 leading-[1.75] font-medium">
							{line}
						</p>
					))}
				</div>
			</div>

			<div className="space-y-3">
				{/* 핵심 특징 */}
				{detailLines.length > 0 && (
					<div
						className="relative bg-white rounded-2xl p-5 overflow-hidden"
						style={{
							border: `1px solid ${colors.border}`,
							boxShadow: `
								0 4px 16px rgba(0, 0, 0, 0.06),
								inset 0 1px 2px rgba(255, 255, 255, 0.5)
							`,
						}}
					>
						{/* 배경 장식 */}
						<div
							className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full opacity-4"
							style={{
								background: `radial-gradient(circle, ${testResult.theme_color}20 0%, transparent 70%)`,
							}}
						/>

						<div className="flex items-center gap-2 mb-5">
							<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
							<h3 className="font-bold text-gray-900 text-[17px]">핵심 특징</h3>
						</div>

						<div className="space-y-4">
							{detailLines.map((item, idx) => {
								const Icon = getIcon(item.key);
								return (
									<div key={idx} className="flex items-start gap-3">
										<div
											className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
											style={{
												backgroundColor: colors.pastelBg,
												boxShadow: `
													0 2px 4px rgba(0, 0, 0, 0.06),
													inset 0 1px 2px rgba(255, 255, 255, 0.5)
												`,
												border: `1px solid ${colors.border}`,
											}}
										>
											<Icon className="w-[18px] h-[18px]" style={{ color: testResult.theme_color || '#3B82F6' }} />
										</div>
										<div className="flex-1 space-y-1 pt-0.5">
											<h4 className="font-semibold text-gray-900 text-[14px]">{item.key}</h4>
											<p className="text-gray-600 text-[13px] leading-[1.6]">{item.value}</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* 적합한 직업 */}
				{features?.['잘 맞는 직업'] &&
					Array.isArray(features['잘 맞는 직업']) &&
					features['잘 맞는 직업'].length > 0 && (
						<div
							className="relative bg-white rounded-2xl p-5 overflow-hidden"
							style={{
								border: `1px solid ${colors.border}`,
								boxShadow: `
								0 4px 16px rgba(0, 0, 0, 0.06),
								inset 0 1px 2px rgba(255, 255, 255, 0.5)
							`,
							}}
						>
							{/* 배경 장식 */}
							<div
								className="absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-4"
								style={{
									background: `radial-gradient(circle, ${testResult.theme_color}20 0%, transparent 70%)`,
								}}
							/>

							<div className="flex items-center gap-2 mb-4">
								<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
								<h3 className="font-bold text-gray-900 text-[17px]">잘 맞는 직업</h3>
							</div>

							<div className="flex flex-wrap gap-2">
								{(features['잘 맞는 직업'] as string[]).slice(0, 8).map((job: string, i: number) => (
									<span
										key={i}
										className="inline-flex items-center px-3.5 py-2 text-[13px] font-medium rounded-full border transition-all hover:scale-105"
										style={{
											backgroundColor: colors.pastelBg,
											color: colors.pastelText,
											borderColor: colors.border,
											boxShadow: `
											0 2px 4px rgba(0, 0, 0, 0.04),
											inset 0 1px 2px rgba(255, 255, 255, 0.3)
										`,
										}}
									>
										{job}
									</span>
								))}
							</div>
						</div>
					)}

				{/* 궁합 정보 */}
				{((features?.['최고의 궁합'] && Array.isArray(features['최고의 궁합']) && features['최고의 궁합'].length > 0) ||
					(features?.['최악의 궁합'] &&
						Array.isArray(features['최악의 궁합']) &&
						features['최악의 궁합'].length > 0)) && (
					<div
						className="relative bg-white rounded-2xl p-5 overflow-hidden"
						style={{
							border: `1px solid ${colors.border}`,
							boxShadow: `
								0 4px 16px rgba(0, 0, 0, 0.06),
								inset 0 1px 2px rgba(255, 255, 255, 0.5)
							`,
						}}
					>
						{/* 배경 장식 */}
						<div
							className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-4"
							style={{
								background: `radial-gradient(circle, ${testResult.theme_color}20 0%, transparent 70%)`,
							}}
						/>

						<div className="flex items-center gap-2 mb-4">
							<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
							<h3 className="font-bold text-gray-900 text-[17px]">궁합 정보</h3>
						</div>

						<div className="space-y-4">
							{features['최고의 궁합'] &&
								Array.isArray(features['최고의 궁합']) &&
								features['최고의 궁합'].length > 0 && (
									<div>
										<div className="flex items-center gap-1.5 mb-2.5">
											<span className="text-base">💕</span>
											<h4 className="font-semibold text-gray-700 text-[14px]">최고 궁합</h4>
										</div>
										<div className="flex flex-wrap gap-2">
											{(features['최고의 궁합'] as string[]).map((type: string, i: number) => (
												<span
													key={i}
													className="inline-flex items-center px-4 py-2 text-[14px] font-semibold rounded-full border transition-colors hover:scale-105"
													style={{
														background: 'linear-gradient(135deg, #fce7f3 0%, #ffe4e6 100%)',
														color: '#be185d',
														borderColor: '#fbcfe8',
														boxShadow: `
														0 2px 4px rgba(236, 72, 153, 0.1),
														inset 0 1px 2px rgba(255, 255, 255, 0.5)
													`,
													}}
												>
													{type}
												</span>
											))}
										</div>
									</div>
								)}

							{features['최악의 궁합'] &&
								Array.isArray(features['최악의 궁합']) &&
								features['최악의 궁합'].length > 0 && (
									<div>
										<div className="flex items-center gap-1.5 mb-2.5">
											<span className="text-base">⚡</span>
											<h4 className="font-semibold text-gray-700 text-[14px]">주의할 궁합</h4>
										</div>
										<div className="flex flex-wrap gap-2">
											{(features['최악의 궁합'] as string[]).map((type: string, i: number) => (
												<span
													key={i}
													className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 text-[14px] font-medium rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
												>
													{type}
												</span>
											))}
										</div>
									</div>
								)}
						</div>
					</div>
				)}

				{/* 선물 추천 */}
				{features?.['선호하는 선물'] && typeof features['선호하는 선물'] === 'string' && (
					<div
						className="relative bg-white rounded-2xl p-5 overflow-hidden"
						style={{
							border: `1px solid ${colors.border}`,
							boxShadow: `
								0 4px 16px rgba(0, 0, 0, 0.06),
								inset 0 1px 2px rgba(255, 255, 255, 0.5)
							`,
						}}
					>
						{/* 배경 장식 */}
						<div
							className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-4"
							style={{
								background: `radial-gradient(circle, ${testResult.theme_color}20 0%, transparent 70%)`,
							}}
						/>

						<div className="flex items-center gap-2 mb-4">
							<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
							<h3 className="font-bold text-gray-900 text-[17px]">추천 선물</h3>
						</div>

						<div className="space-y-2.5">
							{parseGifts(features['선호하는 선물'] as string).map((gift, idx) => (
								<div
									key={idx}
									className="flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-gray-50"
									style={{
										backgroundColor: hexToRgba(testResult.theme_color || '#3B82F6', 0.04),
										borderColor: colors.border,
										boxShadow: `
											0 2px 4px rgba(0, 0, 0, 0.04),
											inset 0 1px 2px rgba(255, 255, 255, 0.3)
										`,
									}}
								>
									<p className="text-gray-700 text-[14px] leading-[1.7] font-medium flex-1">{gift}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

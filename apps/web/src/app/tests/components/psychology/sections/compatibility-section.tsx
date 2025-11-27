'use client';

import { parseStringOrArray } from '@/lib/format-utils';
import { getThemedColors, createCardStyles, createDecorationStyle } from '@/lib/color-utils';

interface ICompatibilitySectionProps {
	bestMatches: string | string[];
	worstMatches: string | string[];
	themeColor: string;
}

export function CompatibilitySection({ bestMatches, worstMatches, themeColor }: ICompatibilitySectionProps) {
	const bestList = parseStringOrArray(bestMatches);
	const worstList = parseStringOrArray(worstMatches);

	if (bestList.length === 0 && worstList.length === 0) return null;

	const colors = getThemedColors(themeColor);
	const cardStyles = createCardStyles(colors);

	return (
		<div className="relative bg-white rounded-2xl p-5 overflow-hidden" style={cardStyles}>
			{/* 배경 장식 */}
			<div
				className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-4"
				style={createDecorationStyle(themeColor, 0.2)}
			/>

			<div className="flex items-center gap-2 mb-4">
				<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
				<h3 className="font-bold text-gray-900 text-[17px]">궁합 정보</h3>
			</div>

			<div className="space-y-4">
				{bestList.length > 0 && (
					<div>
						<div className="flex items-center gap-1.5 mb-2.5">
							<span className="text-base">💕</span>
							<h4 className="font-semibold text-gray-700 text-[14px]">최고 궁합</h4>
						</div>
						<div className="flex flex-wrap gap-2">
							{bestList.map((type: string, i: number) => (
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

				{worstList.length > 0 && (
					<div>
						<div className="flex items-center gap-1.5 mb-2.5">
							<span className="text-base">⚡</span>
							<h4 className="font-semibold text-gray-700 text-[14px]">주의할 궁합</h4>
						</div>
						<div className="flex flex-wrap gap-2">
							{worstList.map((type: string, i: number) => (
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
	);
}

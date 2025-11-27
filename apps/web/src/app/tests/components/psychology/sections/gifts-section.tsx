'use client';

import { parseStringOrArray } from '@/lib/format-utils';
import { getThemedColors, createCardStyles, createDecorationStyle } from '@/lib/color-utils';

interface IGiftsSectionProps {
	gifts: string | string[];
	themeColor: string;
}

export function GiftsSection({ gifts, themeColor }: IGiftsSectionProps) {
	const giftList = parseStringOrArray(gifts);

	if (giftList.length === 0) return null;

	const colors = getThemedColors(themeColor);
	const cardStyles = createCardStyles(colors);
	
	// 테마 색상 RGB 값 계산
	const themeRgb = (() => {
		const cleanHex = themeColor.replace('#', '');
		const r = parseInt(cleanHex.substring(0, 2), 16);
		const g = parseInt(cleanHex.substring(2, 4), 16);
		const b = parseInt(cleanHex.substring(4, 6), 16);
		return `${r}, ${g}, ${b}`;
	})();

	return (
		<div className="relative bg-white rounded-2xl p-5 overflow-hidden" style={cardStyles}>
			{/* 배경 장식 */}
			<div
				className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-4"
				style={createDecorationStyle(themeColor, 0.2)}
			/>

			<div className="flex items-center gap-2 mb-4">
				<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
				<h3 className="font-bold text-gray-900 text-[17px]">추천 선물</h3>
			</div>

			<div className="space-y-2.5">
				{giftList.map((gift, idx) => (
					<div
						key={idx}
						className="flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-gray-50"
						style={{
							backgroundColor: `rgba(${themeRgb}, 0.04)`,
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
	);
}

'use client';

import { parseDescription } from '@/lib/format-utils';
import { hexToRgba, getThemedColors, createCardStyles, createDecorationStyle } from '@/lib/color-utils';

interface IDescriptionSectionProps {
	description: string;
	themeColor: string;
}

export function DescriptionSection({ description, themeColor }: IDescriptionSectionProps) {
	const descriptionLines = parseDescription(description);
	const colors = getThemedColors(themeColor);
	const cardStyles = createCardStyles(colors);

	return (
		<div
			className="relative rounded-2xl p-6 mb-6 overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${hexToRgba(themeColor, 0.08)} 0%, white 100%)`,
				...cardStyles,
			}}
		>
			{/* 배경 장식 */}
			<div
				className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-6"
				style={createDecorationStyle(themeColor, 0.2)}
			/>

			<div className="relative space-y-3">
				{descriptionLines.map((line, idx) => (
					<p key={idx} className="text-[15px] text-gray-800 leading-[1.75] font-medium">
						{line}
					</p>
				))}
			</div>
		</div>
	);
}

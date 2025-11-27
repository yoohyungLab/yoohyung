'use client';

import { parseStringOrArray } from '@/lib/format-utils';
import { getThemedColors, createCardStyles, createDecorationStyle } from '@/lib/color-utils';

interface IJobsSectionProps {
	jobs: string | string[];
	themeColor: string;
}

export function JobsSection({ jobs, themeColor }: IJobsSectionProps) {
	const jobList = parseStringOrArray(jobs);

	if (jobList.length === 0) return null;

	const colors = getThemedColors(themeColor);
	const cardStyles = createCardStyles(colors);

	return (
		<div className="relative bg-white rounded-2xl p-5 overflow-hidden" style={cardStyles}>
			{/* 배경 장식 */}
			<div
				className="absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-4"
				style={createDecorationStyle(themeColor, 0.2)}
			/>

			<div className="flex items-center gap-2 mb-4">
				<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
				<h3 className="font-bold text-gray-900 text-[17px]">잘 맞는 직업</h3>
			</div>

			<div className="flex flex-wrap gap-2">
				{jobList.slice(0, 8).map((job: string, i: number) => (
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
	);
}

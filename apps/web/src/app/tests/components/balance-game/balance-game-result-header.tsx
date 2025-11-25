'use client';

import { Check } from 'lucide-react';

interface IBalanceGameResultHeaderProps {
	testTitle: string;
	userName?: string;
}

export function BalanceGameResultHeader({ testTitle, userName }: IBalanceGameResultHeaderProps) {
	const displayName = userName ? `${userName}님` : '당신';

	return (
		<header className="py-8 px-4">
			<div className="max-w-lg mx-auto text-center space-y-4">
				<div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
					<Check className="w-6 h-6 text-white" />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-black text-gray-900">{testTitle}</h1>
					<p className="text-[15px] text-gray-600">{displayName}의 밸런스 게임 결과에요</p>
				</div>
			</div>
		</header>
	);
}

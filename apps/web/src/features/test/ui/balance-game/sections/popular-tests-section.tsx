'use client';

import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pickid/ui';
import { Users, TrendingUp } from 'lucide-react';
import type { IPopularTest } from '@/shared/types';

interface IPopularTestsSectionProps {
	hotTests: IPopularTest[];
	error: Error | null;
}

export const PopularTestsSection = memo(function PopularTestsSection({ hotTests, error }: IPopularTestsSectionProps) {
	const router = useRouter();

	const handleTestClick = useCallback(
		(testId: string) => {
			router.push(`/tests/${testId}`);
		},
		[router]
	);

	const renderError = () => (
		<div className="text-center py-4">
			<p className="text-sm text-gray-500">인기 테스트를 불러올 수 없습니다</p>
		</div>
	);

	const renderHotTests = () => {
		if (!hotTests || hotTests.length === 0) return null;

		return (
			<div className="space-y-3">
				{hotTests.map((test, index) => (
					<div
						key={test.id}
						onClick={() => handleTestClick(test.id)}
						className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:from-orange-100 hover:to-red-100 cursor-pointer transition-all duration-200 hover:shadow-md"
					>
						{/* 순위 배지 */}
						<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
							{index + 1}
						</div>

						{/* 테스트 정보 */}
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{test.title}</h3>
							<p className="text-xs text-gray-600 truncate">{test.description || test.category}</p>
						</div>

						{/* 참여자 수 */}
						<div className="flex-shrink-0 flex items-center gap-1">
							<Users className="w-3 h-3 text-orange-500" />
							<span className="text-xs font-medium text-orange-600">{test.participantCount.toLocaleString()}</span>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<Card
			className="relative overflow-hidden"
			style={{
				border: '1px solid rgba(0, 0, 0, 0.06)',
				boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
			}}
		>
			<CardHeader className="pb-4">
				<div className="flex items-start gap-3">
					<TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<CardTitle className="text-[17px] mb-1 flex items-center gap-2">
							이번 주 인기 테스트
							<span className="text-orange-500">🔥</span>
						</CardTitle>
						<CardDescription className="text-[14px]">가장 많은 사람들이 참여한 테스트들이에요</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{error && renderError()}
				{!error && hotTests && renderHotTests()}
			</CardContent>
		</Card>
	);
});

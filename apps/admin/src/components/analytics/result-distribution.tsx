import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { PieChart } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { GetTestAnalyticsDataReturn } from '@pickid/supabase';

type TestAnalyticsData = GetTestAnalyticsDataReturn;

interface ResultDistributionProps {
	testData: TestAnalyticsData | null;
	completions: number;
}

export function ResultDistribution({ testData, completions }: ResultDistributionProps) {
	return (
		<AdminCard className="p-5">
			<AdminCardHeader
				title="🎯 결과 분포"
				subtitle="테스트 결과 유형별 분포"
				icon={<PieChart className="w-5 h-5 text-green-600" />}
			/>
			{testData?.popular_results ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						{testData.popular_results.map((result, index) => {
							const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
							return (
								<div key={index} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className={cn('w-4 h-4 rounded', colors[index % colors.length])} />
										<span className="font-medium">{result.result_name}</span>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-24 bg-gray-200 rounded-full h-2">
											<div
												className={cn('h-2 rounded-full', colors[index % colors.length])}
												style={{ width: `${result.percentage}%` }}
											/>
										</div>
										<span className="text-sm font-medium w-12 text-right">{result.percentage}%</span>
										<span className="text-sm text-gray-600 w-16 text-right">{result.count.toLocaleString()}</span>
									</div>
								</div>
							);
						})}
					</div>
					<div className="flex items-center justify-center">
						<div className="w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center bg-white">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">{completions.toLocaleString()}</div>
								<div className="text-sm text-gray-600">총 완료수</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
					<p>결과 분포 데이터가 없습니다</p>
				</div>
			)}
		</AdminCard>
	);
}

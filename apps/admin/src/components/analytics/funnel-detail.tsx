import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { FunnelDataItem } from '@repo/supabase';

interface FunnelDetailProps {
	funnelData: FunnelDataItem[];
}

export function FunnelDetail({ funnelData }: FunnelDetailProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">📋 질문별 상세 분석</h3>
			{funnelData.map((item, index) => {
				const completionRate = item.reached > 0 ? Math.round((item.completed / item.reached) * 100) : 0;
				const maxReached = Math.max(...funnelData.map((q) => q.reached));
				const progressWidth = maxReached > 0 ? (item.reached / maxReached) * 100 : 0;

				return (
					<div key={item.questionId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
						{/* 질문 헤더 */}
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
									Q{index + 1}
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-gray-900 text-lg leading-tight">{item.question}</h4>
									<p className="text-sm text-gray-500 mt-1">
										{item.reached}명이 도달했고, {item.completed}명이 완료했습니다
									</p>
								</div>
							</div>
							<div className="text-right">
								<div
									className={cn(
										'text-2xl font-bold',
										item.dropoff > 50 ? 'text-red-600' : item.dropoff > 20 ? 'text-yellow-600' : 'text-green-600'
									)}
								>
									{item.dropoff}%
								</div>
								<div className="text-xs text-gray-500">이탈률</div>
							</div>
						</div>

						{/* 진행률 바 */}
						<div className="mb-4">
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>도달수</span>
								<span>{item.reached.toLocaleString()}명</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3">
								<div
									className="bg-blue-500 h-3 rounded-full transition-all duration-300"
									style={{ width: `${progressWidth}%` }}
								/>
							</div>
						</div>

						{/* 상세 지표 */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div className="text-lg font-bold text-gray-900">{item.reached.toLocaleString()}</div>
								<div className="text-xs text-gray-500">도달수</div>
							</div>
							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div className="text-lg font-bold text-gray-900">{item.completed.toLocaleString()}</div>
								<div className="text-xs text-gray-500">완료수</div>
							</div>
							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div
									className={cn(
										'text-lg font-bold',
										completionRate > 80 ? 'text-green-600' : completionRate > 60 ? 'text-yellow-600' : 'text-red-600'
									)}
								>
									{completionRate}%
								</div>
								<div className="text-xs text-gray-500">완료율</div>
							</div>
							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div className="text-lg font-bold text-gray-900">{item.avgTime}초</div>
								<div className="text-xs text-gray-500">평균 소요시간</div>
							</div>
						</div>

						{/* 완료율 진행률 바 */}
						<div className="mt-4">
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>완료율</span>
								<span>{completionRate}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={cn(
										'h-2 rounded-full transition-all duration-300',
										completionRate > 80 ? 'bg-green-500' : completionRate > 60 ? 'bg-yellow-500' : 'bg-red-500'
									)}
									style={{ width: `${completionRate}%` }}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

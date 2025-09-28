import React, { useState } from 'react';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';
import { MarketingFiltersComponent } from '@/components/marketing/marketing-filters';
import { BarChart3, Activity } from 'lucide-react';

export function GrowthPage() {
	const { funnelData, landingPerformance, devices, regions, filters, setFilters, loading } = useMarketingAnalytics();

	const [activeTab, setActiveTab] = useState<'overview' | 'traffic'>('overview');

	const tabs = [
		{ id: 'overview', label: '개요', icon: BarChart3 },
		{ id: 'traffic', label: '유입 통계', icon: Activity },
	];

	return (
		<div className="space-y-6">
			{/* 필터 */}
			<MarketingFiltersComponent
				filters={filters}
				onFiltersChange={setFilters}
				devices={devices}
				regions={regions}
				loading={loading.filters}
			/>

			{/* 탭 네비게이션 */}
			<div className="border-b border-gray-200">
				<nav className="-mb-px flex space-x-8">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as 'overview' | 'traffic')}
								className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.id
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								<Icon className="w-4 h-4" />
								{tab.label}
							</button>
						);
					})}
				</nav>
			</div>

			{/* 탭 콘텐츠 */}
			<div className="space-y-6">
				{activeTab === 'overview' && (
					<div className="space-y-6">
						{/* 핵심 지표 카드들 */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Activity className="h-8 w-8 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">총 방문자</p>
										<p className="text-2xl font-semibold text-gray-900">{funnelData?.visits || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="h-8 w-8 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">테스트 시작</p>
										<p className="text-2xl font-semibold text-gray-900">{funnelData?.test_starts || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Activity className="h-8 w-8 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">테스트 완료</p>
										<p className="text-2xl font-semibold text-gray-900">{funnelData?.test_completes || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="h-8 w-8 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">완료율</p>
										<p className="text-2xl font-semibold text-gray-900">
											{funnelData?.complete_rate?.toFixed(1) || 0}%
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 주요 통계 요약 */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* 최근 활동 요약 */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
								<div className="space-y-3 text-sm text-gray-600">
									<div className="flex justify-between">
										<span>오늘 테스트 응답:</span>
										<span className="font-medium text-gray-900">{funnelData?.test_completes || 0}건</span>
									</div>
									<div className="flex justify-between">
										<span>이번 주 총 응답:</span>
										<span className="font-medium text-gray-900">{funnelData?.visits || 0}건</span>
									</div>
									<div className="flex justify-between">
										<span>평균 완료율:</span>
										<span className="font-medium text-gray-900">{funnelData?.complete_rate?.toFixed(1) || 0}%</span>
									</div>
									<div className="flex justify-between">
										<span>시작율:</span>
										<span className="font-medium text-gray-900">{funnelData?.start_rate?.toFixed(1) || 0}%</span>
									</div>
								</div>
							</div>

							{/* 시스템 상태 */}
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
								<div className="space-y-3 text-sm text-gray-600">
									<div className="flex justify-between">
										<span>활성 테스트 수:</span>
										<span className="font-medium text-gray-900">{landingPerformance?.length || 0}개</span>
									</div>
									<div className="flex justify-between">
										<span>데이터 수집 상태:</span>
										<span className="font-medium text-green-600">정상</span>
									</div>
									<div className="flex justify-between">
										<span>마지막 업데이트:</span>
										<span className="font-medium text-gray-900">방금 전</span>
									</div>
									<div className="flex justify-between">
										<span>서버 상태:</span>
										<span className="font-medium text-green-600">온라인</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'traffic' && (
					<div className="space-y-6">
						{/* 유입 통계 카드들 */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Activity className="h-8 w-8 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">총 방문자</p>
										<p className="text-2xl font-semibold text-gray-900">{funnelData?.visits || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="h-8 w-8 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">완료율</p>
										<p className="text-2xl font-semibold text-gray-900">
											{funnelData?.complete_rate?.toFixed(1) || 0}%
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Activity className="h-8 w-8 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">테스트 수</p>
										<p className="text-2xl font-semibold text-gray-900">{landingPerformance?.length || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="h-8 w-8 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">시작율</p>
										<p className="text-2xl font-semibold text-gray-900">{funnelData?.start_rate?.toFixed(1) || 0}%</p>
									</div>
								</div>
							</div>
						</div>

						{/* 디바이스별 유입 통계 */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">디바이스별 유입 통계</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{devices?.map((device, index) => (
									<div key={index} className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-gray-900 capitalize">{device}</span>
											<span className="text-sm text-gray-500">데이터 수집 중</span>
										</div>
									</div>
								)) || (
									<div className="col-span-full text-center py-8 text-gray-500">
										<p>디바이스별 데이터를 수집 중입니다.</p>
									</div>
								)}
							</div>
						</div>

						{/* 지역별 유입 통계 */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">지역별 유입 통계</h3>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								{regions?.map((region, index) => (
									<div key={index} className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-gray-900">{region}</span>
											<span className="text-sm text-gray-500">데이터 수집 중</span>
										</div>
									</div>
								)) || (
									<div className="col-span-full text-center py-8 text-gray-500">
										<p>지역별 데이터를 수집 중입니다.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

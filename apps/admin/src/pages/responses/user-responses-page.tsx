import React from 'react';
import { TrendingUp, Clock, Smartphone } from 'lucide-react';
import { ResponseStatsCards, ResponseFilters } from '@/components/response';

export function UserResponsesPage() {
	// 정적 통계 데이터 (실제로는 API에서 가져와야 함)
	const stats = {
		total_responses: 0,
		completed_responses: 0,
		completion_rate: 0,
		avg_completion_time: 0,
		mobile_ratio: 0,
		mobile_count: 0,
		desktop_count: 0,
		unique_users: 0,
	};

	const loading = false;
	const filters = {
		search: '',
		testId: 'all',
		category: 'all',
		device: 'all',
		dateFrom: '',
		dateTo: '',
	};

	const updateFilters = () => {};
	const onExport = () => {};

	return (
		<div className="space-y-6 p-5">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">응답 분석</h1>
					<p className="text-gray-600 mt-1">전체 응답 통계 및 분석 데이터</p>
				</div>
			</div>

			{/* 필터 */}
			<ResponseFilters filters={filters} loading={loading} onFilterChange={updateFilters} onExport={onExport} />

			{/* 주요 통계 카드 */}
			<ResponseStatsCards stats={stats} />

			{/* 추가 통계 정보 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* 디바이스 분포 */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<Smartphone className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">디바이스 분포</h3>
							<p className="text-sm text-gray-600">사용자 접속 기기</p>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">모바일</span>
							<span className="text-sm font-medium text-gray-900">{stats.mobile_count}명</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">데스크톱</span>
							<span className="text-sm font-medium text-gray-900">{stats.desktop_count}명</span>
						</div>
					</div>
				</div>

				{/* 완료율 상세 */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<TrendingUp className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">완료 현황</h3>
							<p className="text-sm text-gray-600">테스트 완료 통계</p>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">완료된 응답</span>
							<span className="text-sm font-medium text-gray-900">{stats.completed_responses}개</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">전체 응답</span>
							<span className="text-sm font-medium text-gray-900">{stats.total_responses}개</span>
						</div>
					</div>
				</div>

				{/* 평균 소요시간 상세 */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
							<Clock className="w-5 h-5 text-purple-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">소요시간</h3>
							<p className="text-sm text-gray-600">평균 완료 시간</p>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">평균 시간</span>
							<span className="text-sm font-medium text-gray-900">{Math.round(stats.avg_completion_time)}초</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">분 단위</span>
							<span className="text-sm font-medium text-gray-900">{Math.round(stats.avg_completion_time / 60)}분</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

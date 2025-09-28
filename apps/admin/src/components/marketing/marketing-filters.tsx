import React from 'react';
import { MarketingFilters } from '@/shared/api';

interface MarketingFiltersProps {
	filters: MarketingFilters;
	onFiltersChange: (filters: Partial<MarketingFilters>) => void;
	devices: string[];
	regions: string[];
	loading: boolean;
}

export function MarketingFiltersComponent({
	filters,
	onFiltersChange,
	devices,
	regions,
	loading,
}: MarketingFiltersProps) {
	const handleFilterChange = (key: keyof MarketingFilters, value: string | undefined) => {
		onFiltersChange({ [key]: value });
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">필터 설정</h3>
				{loading && <span className="text-sm text-gray-500">로딩 중...</span>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{/* 기간 필터 */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">시작일</label>
					<input
						type="date"
						value={filters.from}
						onChange={(e) => handleFilterChange('from', e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={loading}
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">종료일</label>
					<input
						type="date"
						value={filters.to}
						onChange={(e) => handleFilterChange('to', e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={loading}
					/>
				</div>

				{/* 디바이스 */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">디바이스</label>
					<select
						value={filters.device || ''}
						onChange={(e) => handleFilterChange('device', e.target.value as 'mobile' | 'desktop' | undefined)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={loading}
					>
						<option value="">전체</option>
						{devices.map((device) => (
							<option key={device} value={device}>
								{device === 'mobile' ? '모바일' : device === 'desktop' ? '데스크톱' : device}
							</option>
						))}
					</select>
				</div>

				{/* 지역 */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">지역</label>
					<select
						value={filters.region || ''}
						onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={loading}
					>
						<option value="">전체</option>
						{regions.map((region) => (
							<option key={region} value={region}>
								{region}
							</option>
						))}
					</select>
				</div>

				{/* 사용자 유형 */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">사용자 유형</label>
					<select
						value={filters.userType || ''}
						onChange={(e) => handleFilterChange('userType', e.target.value as 'new' | 'returning' | undefined)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={loading}
					>
						<option value="">전체</option>
						<option value="new">신규 사용자</option>
						<option value="returning">재방문 사용자</option>
					</select>
				</div>
			</div>

			{/* 빠른 필터 버튼들 */}
			<div className="mt-4 flex flex-wrap gap-2">
				<button
					onClick={() =>
						onFiltersChange({
							from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
							to: new Date().toISOString().split('T')[0],
						})
					}
					className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
					disabled={loading}
				>
					최근 7일
				</button>
				<button
					onClick={() =>
						onFiltersChange({
							from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
							to: new Date().toISOString().split('T')[0],
						})
					}
					className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
					disabled={loading}
				>
					최근 30일
				</button>
				<button
					onClick={() =>
						onFiltersChange({
							from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
							to: new Date().toISOString().split('T')[0],
						})
					}
					className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
					disabled={loading}
				>
					최근 90일
				</button>
				<button
					onClick={() =>
						onFiltersChange({
							from: '',
							to: '',
							device: undefined,
							region: undefined,
							userType: undefined,
						})
					}
					className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
					disabled={loading}
				>
					필터 초기화
				</button>
			</div>
		</div>
	);
}

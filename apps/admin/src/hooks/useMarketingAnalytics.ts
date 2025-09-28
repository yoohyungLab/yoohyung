import { useState, useEffect, useCallback } from 'react';
import { marketingService, MarketingFilters, FunnelData, LandingPerformance } from '../shared/api';

export interface UseMarketingAnalyticsReturn {
	// 데이터
	funnelData: FunnelData | null;
	landingPerformance: LandingPerformance[];

	// 필터 옵션
	devices: string[];
	regions: string[];

	// 필터 상태
	filters: MarketingFilters;
	setFilters: (filters: Partial<MarketingFilters>) => void;

	// 로딩 상태
	loading: {
		funnel: boolean;
		landings: boolean;
		filters: boolean;
	};
}

const defaultFilters: MarketingFilters = {
	from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30일 전
	to: new Date().toISOString().split('T')[0], // 오늘
};

export function useMarketingAnalytics(): UseMarketingAnalyticsReturn {
	const [filters, setFiltersState] = useState<MarketingFilters>(defaultFilters);
	const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
	const [landingPerformance, setLandingPerformance] = useState<LandingPerformance[]>([]);

	const [devices, setDevices] = useState<string[]>([]);
	const [regions, setRegions] = useState<string[]>([]);

	const [loading, setLoading] = useState({
		funnel: false,
		landings: false,
		filters: false,
	});

	// 필터 업데이트
	const setFilters = useCallback((newFilters: Partial<MarketingFilters>) => {
		setFiltersState((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 퍼널 데이터 로드
	const loadFunnelData = useCallback(async () => {
		setLoading((prev) => ({ ...prev, funnel: true }));
		try {
			const data = await marketingService.getFunnelData(filters);
			setFunnelData(data);
		} catch (error) {
			console.error('퍼널 데이터 로드 실패:', error);
		} finally {
			setLoading((prev) => ({ ...prev, funnel: false }));
		}
	}, [filters]);

	// 랜딩 성과 데이터 로드
	const loadLandingPerformance = useCallback(async () => {
		setLoading((prev) => ({ ...prev, landings: true }));
		try {
			const data = await marketingService.getLandingPerformance(filters);
			setLandingPerformance(data);
		} catch (error) {
			console.error('랜딩 성과 데이터 로드 실패:', error);
		} finally {
			setLoading((prev) => ({ ...prev, landings: false }));
		}
	}, [filters]);

	// 필터 옵션 로드
	const loadFilterOptions = useCallback(async () => {
		setLoading((prev) => ({ ...prev, filters: true }));
		try {
			const [deviceList, regionList] = await Promise.all([
				marketingService.getDevices(),
				marketingService.getRegions(),
			]);

			setDevices(deviceList);
			setRegions(regionList);
		} catch (error) {
			console.error('필터 옵션 로드 실패:', error);
		} finally {
			setLoading((prev) => ({ ...prev, filters: false }));
		}
	}, []);

	// 초기 로드
	useEffect(() => {
		loadFilterOptions();
	}, [loadFilterOptions]);

	// 필터 변경 시 데이터 새로고침
	useEffect(() => {
		loadFunnelData();
		loadLandingPerformance();
	}, [loadFunnelData, loadLandingPerformance]);

	return {
		// 데이터
		funnelData,
		landingPerformance,

		// 필터 옵션
		devices,
		regions,

		// 필터 상태
		filters,
		setFilters,

		// 로딩 상태
		loading,
	};
}

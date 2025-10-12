'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { categoryService } from '@/shared/api/services/category.service';
import type { Category } from '@pickid/supabase';

// 뷰에서 사용할 가공된 카테고리 타입 - Supabase Category 타입 기반
export interface ProcessedCategory extends Pick<Category, 'id' | 'slug'> {
	// Supabase에 없는 클라이언트 전용 필드들
	label: string;
	icon: string;
	color: string;
	count: number;
}

// 카테고리 아이콘 매핑
const categoryIcons: Record<string, string> = {
	personality: '🧠',
	love: '💝',
	emotion: '💭',
	career: '💼',
	lifestyle: '🌟',
	default: '🎯',
};

// 카테고리 색상 매핑
const categoryColors: Record<string, string> = {
	personality: 'from-violet-500 to-purple-600',
	love: 'from-pink-500 to-rose-600',
	emotion: 'from-blue-500 to-indigo-600',
	career: 'from-emerald-500 to-teal-600',
	lifestyle: 'from-orange-500 to-red-600',
	default: 'from-slate-500 to-slate-600',
};

// useCategories 훅 - 카테고리 상태와 액션을 모두 포함 (로딩/에러 내부 처리)
export const useCategories = () => {
	const [rawCategories, setRawCategories] = useState<Array<Category & { test_count: number }>>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 카테고리 데이터 로딩
	const loadCategories = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoryService.getCategoryWithTestCounts();
			setRawCategories(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.';
			setError(errorMessage);
			console.error('Error loading categories:', err);
			// 에러 시 빈 배열로 설정
			setRawCategories([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// 초기 로딩 - 웹에서는 항상 활성 카테고리만 로딩
	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	// 카테고리 데이터를 뷰에서 사용할 형태로 가공
	const categories = useMemo(() => {
		if (loading || error || !rawCategories.length) {
			return [];
		}

		// 전체 카테고리 추가
		const totalCount = rawCategories.reduce((sum, cat) => sum + cat.test_count, 0);
		const allCategory: ProcessedCategory = {
			id: 'all',
			label: '전체',
			icon: '🎯',
			color: 'from-slate-500 to-slate-600',
			count: totalCount,
			slug: 'all',
		};

		// 개별 카테고리들 가공
		const individualCategories: ProcessedCategory[] = rawCategories.map((category) => ({
			id: category.id,
			label: category.name,
			icon: categoryIcons[category.slug] || categoryIcons.default,
			color: categoryColors[category.slug] || categoryColors.default,
			count: category.test_count,
			slug: category.slug,
		}));

		return [allCategory, ...individualCategories];
	}, [rawCategories, loading, error]);

	return {
		// 상태 (로딩/에러는 내부 처리)
		categories,

		// 액션
		loadCategories,

		// 편의 메서드
		refetch: loadCategories,
	};
};

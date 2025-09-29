import { useState, useCallback, useEffect, useMemo } from 'react';
import { categoryService } from '@/shared/api';
import type { Category, CategoryFilters } from '@repo/supabase';

interface CategoryStats {
	total: number;
	active: number;
	inactive: number;
}

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<CategoryFilters>({
		search: '',
		status: 'all',
	});

	// 통계 계산
	const stats = useMemo((): CategoryStats => {
		if (categories.length === 0) {
			return {
				total: 0,
				active: 0,
				inactive: 0,
			};
		}

		return {
			total: categories.length,
			active: categories.filter((category) => category.is_active).length,
			inactive: categories.filter((category) => !category.is_active).length,
		};
	}, [categories]);

	// 필터링된 카테고리
	const filteredCategories = useMemo(() => {
		return categories.filter((category) => {
			const matchesSearch =
				!filters.search ||
				category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				category.description?.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus =
				filters.status === 'all' ||
				(filters.status === 'active' && category.is_active) ||
				(filters.status === 'inactive' && !category.is_active);
			return matchesSearch && matchesStatus;
		});
	}, [categories, filters]);

	// 데이터 로딩
	const loadCategories = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoryService.getCategories();
			setCategories(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 카테고리 생성
	const createCategory = useCallback(
		async (categoryData: {
			name: string;
			slug: string;
			description?: string;
			sort_order?: number;
			is_active?: boolean;
		}) => {
			try {
				const newCategory = await categoryService.createCategory(categoryData);
				setCategories((prev) => [newCategory, ...prev]); // 맨 앞에 추가
				return newCategory;
			} catch (err) {
				setError(err instanceof Error ? err.message : '카테고리 생성에 실패했습니다.');
				throw err;
			}
		},
		[]
	);

	// 카테고리 수정
	const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
		try {
			const updatedCategory = await categoryService.updateCategory(id, updates);
			setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
			return updatedCategory;
		} catch (err) {
			setError(err instanceof Error ? err.message : '카테고리 수정에 실패했습니다.');
			throw err;
		}
	}, []);

	// 상태 변경
	const updateCategoryStatus = useCallback(async (id: string, isActive: boolean) => {
		try {
			const updatedCategory = await categoryService.updateCategoryStatus(id, isActive);
			setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
		} catch (err) {
			setError(err instanceof Error ? err.message : '카테고리 상태 변경에 실패했습니다.');
		}
	}, []);

	// 대량 상태 변경
	const bulkUpdateStatus = useCallback(
		async (categoryIds: string[], isActive: boolean) => {
			try {
				await categoryService.bulkUpdateStatus(categoryIds, isActive);
				// 상태 업데이트 후 전체 데이터 다시 로드
				await loadCategories();
			} catch (err) {
				setError(err instanceof Error ? err.message : '카테고리 일괄 상태 변경에 실패했습니다.');
			}
		},
		[loadCategories]
	);

	// 삭제
	const deleteCategory = useCallback(async (id: string) => {
		try {
			await categoryService.deleteCategory(id);
			setCategories((prev) => prev.filter((cat) => cat.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : '카테고리 삭제에 실패했습니다.');
		}
	}, []);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩
	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	return {
		categories: filteredCategories,
		loading,
		error,
		filters,
		stats,
		loadCategories,
		fetchCategories: loadCategories, // 별칭 추가
		createCategory,
		updateCategory,
		updateCategoryStatus,
		bulkUpdateStatus,
		deleteCategory,

		updateFilters,
	};
};

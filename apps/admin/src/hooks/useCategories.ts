import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import { queryKeys } from '@/shared/lib/query-client';
import { CATEGORY_STATUS_VALUES } from '@/shared/lib/constants/options';
import type { Category, CategoryFilters } from '@pickid/supabase';

interface ICategoryStats {
	total: number;
	active: number;
	inactive: number;
}

export const useCategories = () => {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<CategoryFilters>({
		search: '',
		status: 'all',
	});

	const {
		data: categories = [],
		isLoading,
		error: queryError,
	} = useQuery({
		queryKey: queryKeys.categories.all,
		queryFn: () => categoryService.getCategories(),
	});

	const error = queryError ? (queryError instanceof Error ? queryError.message : '카테고리를 불러오는데 실패했습니다.') : null;

	// 통계 계산
	const stats = useMemo((): ICategoryStats => {
		if (categories.length === 0) {
			return {
				total: 0,
				active: 0,
				inactive: 0,
			};
		}

		return {
			total: categories.length,
			active: categories.filter((category) => category.status === CATEGORY_STATUS_VALUES.ACTIVE).length,
			inactive: categories.filter((category) => category.status === CATEGORY_STATUS_VALUES.INACTIVE).length,
		};
	}, [categories]);

	// 필터링된 카테고리
	const filteredCategories = useMemo(() => {
		return categories.filter((category) => {
			const matchesSearch = !filters.search || category.name.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus =
				filters.status === CATEGORY_STATUS_VALUES.ALL ||
				(filters.status === CATEGORY_STATUS_VALUES.ACTIVE && category.status === CATEGORY_STATUS_VALUES.ACTIVE) ||
				(filters.status === CATEGORY_STATUS_VALUES.INACTIVE && category.status === CATEGORY_STATUS_VALUES.INACTIVE);
			return matchesSearch && matchesStatus;
		});
	}, [categories, filters]);

	// 카테고리 생성
	const createCategoryMutation = useMutation({
		mutationFn: (categoryData: {
			name: string;
			slug: string;
			sort_order?: number;
			status?: 'active' | 'inactive';
		}) => categoryService.createCategory(categoryData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
	});

	// 카테고리 수정
	const updateCategoryMutation = useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
			categoryService.updateCategory(id, updates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
	});

	// 상태 변경
	const updateCategoryStatusMutation = useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			categoryService.updateCategoryStatus(id, isActive),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
	});

	// 대량 상태 변경
	const bulkUpdateStatusMutation = useMutation({
		mutationFn: ({ categoryIds, isActive }: { categoryIds: string[]; isActive: boolean }) =>
			categoryService.bulkUpdateStatus(categoryIds, isActive),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
	});

	// 삭제
	const deleteCategoryMutation = useMutation({
		mutationFn: (id: string) => categoryService.deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
	});

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		categories: filteredCategories,
		loading: isLoading,
		error,
		filters,
		stats,
		createCategory: createCategoryMutation.mutateAsync,
		updateCategory: updateCategoryMutation.mutateAsync,
		updateCategoryStatus: updateCategoryStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateStatusMutation.mutateAsync,
		deleteCategory: deleteCategoryMutation.mutateAsync,
		updateFilters,
	};
};

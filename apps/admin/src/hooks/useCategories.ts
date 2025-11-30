import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import { queryKeys } from '@pickid/shared';
import { useToast } from '@pickid/shared';
import { CATEGORY_STATUS_VALUES } from '@/constants/category';
import type { Category } from '@pickid/supabase';
import type { CategoryFilters, ICategoryStats } from '@/types/category.types';

export const useCategories = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	const [filters, setFilters] = useState<CategoryFilters>({
		search: '',
		status: 'all',
	});

	const { data: categories = [], isLoading } = useQuery({
		queryKey: queryKeys.categories.all,
		queryFn: () => categoryService.getCategories(),
	});

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

	const createCategoryMutation = useMutation({
		mutationFn: (categoryData: { name: string; slug: string; sort_order?: number; status?: 'active' | 'inactive' }) =>
			categoryService.createCategory(categoryData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success('카테고리가 생성되었습니다.');
		},
	});

	const updateCategoryMutation = useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
			categoryService.updateCategory(id, updates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success('카테고리가 수정되었습니다.');
		},
	});

	const updateCategoryStatusMutation = useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			categoryService.updateCategoryStatus(id, isActive),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success('카테고리 상태가 변경되었습니다.');
		},
	});

	const bulkUpdateStatusMutation = useMutation({
		mutationFn: ({ categoryIds, isActive }: { categoryIds: string[]; isActive: boolean }) =>
			categoryService.bulkUpdateStatus(categoryIds, isActive),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success('대량 상태 변경이 완료되었습니다.');
		},
	});

	const deleteCategoryMutation = useMutation({
		mutationFn: (id: string) => categoryService.deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success('카테고리가 삭제되었습니다.');
		},
	});

	const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		categories: filteredCategories,
		loading: isLoading,
		filters,
		stats,
		updateFilters,
		createCategory: createCategoryMutation.mutateAsync,
		updateCategory: updateCategoryMutation.mutateAsync,
		updateCategoryStatus: updateCategoryStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateStatusMutation.mutateAsync,
		deleteCategory: deleteCategoryMutation.mutateAsync,
	};
};

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/shared/api';
import { queryKeys } from '@/shared/lib/query-client';
import type { Category, CategoryFilters } from '@pickid/supabase';

interface CategoryStats {
	total: number;
	active: number;
	inactive: number;
}

export const useCategories = () => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<CategoryFilters>({
		search: '',
		status: 'all',
	});

	const {
		data: categories = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: queryKeys.categories.all,
		queryFn: () => categoryService.getCategories(),
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
			active: categories.filter((category) => category.status === 'active').length,
			inactive: categories.filter((category) => category.status === 'inactive').length,
		};
	}, [categories]);

	// 필터링된 카테고리
	const filteredCategories = useMemo(() => {
		return categories.filter((category) => {
			const matchesSearch = !filters.search || category.name.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus =
				filters.status === 'all' ||
				(filters.status === 'active' && category.status === 'active') ||
				(filters.status === 'inactive' && category.status === 'inactive');
			return matchesSearch && matchesStatus;
		});
	}, [categories, filters]);

	const loadCategories = useCallback(async () => {
		setError(null);
		await refetch();
	}, [refetch]);

	// 카테고리 생성
	const { mutateAsync: createCategory } = useMutation({
		mutationFn: async (categoryData: {
			name: string;
			slug: string;
			sort_order?: number;
			status?: 'active' | 'inactive';
		}) => {
			return categoryService.createCategory(categoryData);
		},
		onSuccess: (newCategory) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (prev = []) => [newCategory, ...prev]);
		},
		onError: (err: unknown) => {
			let errorMessage = '카테고리 생성에 실패했습니다.';
			if (err instanceof Error) {
				if (err.message.includes('duplicate key value violates unique constraint')) {
					if (err.message.includes('categories_slug_key')) {
						errorMessage = '이미 사용 중인 카테고리명입니다. 다른 이름을 사용해주세요.';
					} else if (err.message.includes('categories_name_key')) {
						errorMessage = '이미 사용 중인 카테고리명입니다. 다른 이름을 사용해주세요.';
					}
				} else {
					errorMessage = err.message;
				}
			}
			setError(errorMessage);
		},
	});

	// 카테고리 수정
	const { mutateAsync: updateCategory } = useMutation({
		mutationFn: async ({ id, updates }: { id: string; updates: Partial<Category> }) => {
			return categoryService.updateCategory(id, updates);
		},
		onSuccess: (updatedCategory) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (prev = []) =>
				prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
			);
		},
		onError: (err: unknown) => {
			let errorMessage = '카테고리 수정에 실패했습니다.';
			if (err instanceof Error) {
				if (err.message.includes('duplicate key value violates unique constraint')) {
					if (err.message.includes('categories_slug_key')) {
						errorMessage = '이미 사용 중인 카테고리명입니다. 다른 이름을 사용해주세요.';
					} else if (err.message.includes('categories_name_key')) {
						errorMessage = '이미 사용 중인 카테고리명입니다. 다른 이름을 사용해주세요.';
					}
				} else {
					errorMessage = err.message;
				}
			}
			setError(errorMessage);
		},
	});

	// 상태 변경
	const { mutateAsync: updateCategoryStatus } = useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
			return categoryService.updateCategoryStatus(id, isActive);
		},
		onSuccess: (updatedCategory) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (prev = []) =>
				prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
			);
		},
		onError: (err: unknown) => {
			setError(err instanceof Error ? err.message : '카테고리 상태 변경에 실패했습니다.');
		},
	});

	// 대량 상태 변경
	const { mutateAsync: bulkUpdateStatus } = useMutation({
		mutationFn: async ({ categoryIds, isActive }: { categoryIds: string[]; isActive: boolean }) => {
			return categoryService.bulkUpdateStatus(categoryIds, isActive);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
		},
		onError: (err: unknown) => {
			setError(err instanceof Error ? err.message : '카테고리 일괄 상태 변경에 실패했습니다.');
		},
	});

	// 삭제
	const { mutateAsync: deleteCategory } = useMutation({
		mutationFn: async (id: string) => categoryService.deleteCategory(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.categories.all });
			const previous = queryClient.getQueryData<Category[]>(queryKeys.categories.all);
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (prev = []) =>
				prev.filter((cat) => cat.id !== id)
			);
			return { previous } as { previous?: Category[] };
		},
		onError: (_err, _id, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.categories.all, context.previous);
		},
		onSettled: () => {
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
		loadCategories,
		fetchCategories: loadCategories,
		createCategory,
		updateCategory: (id: string, updates: Partial<Category>) => updateCategory({ id, updates }),
		updateCategoryStatus: (id: string, isActive: boolean) => updateCategoryStatus({ id, isActive }),
		bulkUpdateStatus: (categoryIds: string[], isActive: boolean) => bulkUpdateStatus({ categoryIds, isActive }),
		deleteCategory,
		updateFilters,
	} as const;
};

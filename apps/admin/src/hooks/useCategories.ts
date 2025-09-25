import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '../shared/api/services/category.service';
import type { CategoryFilters, CategoryStats } from '../shared/api/services/category.service';
import type { Category } from '@repo/supabase';

type CategoryWithStatus = Category & {
	status?: 'active' | 'inactive';
};

export const useCategories = () => {
	const [categories, setCategories] = useState<CategoryWithStatus[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCategories, setTotalCategories] = useState(0);
	const [stats, setStats] = useState<CategoryStats>({
		total: 0,
		active: 0,
		inactive: 0,
	});

	// 자동으로 모든 카테고리 로드
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [categoryResult, statsResult] = await Promise.all([
					categoryService.getCategories({}, 1, 20),
					categoryService.getCategoryStats(),
				]);

				const categoriesWithStatus = categoryResult.categories.map((c: Category) => ({
					...c,
					status: c.is_active ? ('active' as const) : ('inactive' as const),
				}));

				setCategories(categoriesWithStatus);
				setTotalCategories(categoryResult.total);
				setStats(statsResult);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	const fetchCategories = useCallback(async (filters?: CategoryFilters, page: number = 1, pageSize: number = 20) => {
		try {
			setLoading(true);
			setError(null);

			const [categoryResult, statsResult] = await Promise.all([
				categoryService.getCategories(filters || {}, page, pageSize),
				categoryService.getCategoryStats(),
			]);

			const categoriesWithStatus = categoryResult.categories.map((c) => ({
				...c,
				status: c.is_active ? ('active' as const) : ('inactive' as const),
			}));

			setCategories(categoriesWithStatus);
			setTotalCategories(categoryResult.total);
			setStats(statsResult);

			return {
				categories: categoriesWithStatus,
				total: categoryResult.total,
				totalPages: categoryResult.totalPages,
				currentPage: categoryResult.currentPage,
			};
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchActiveCategories = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoryService.getActiveCategories();
			const categoriesWithStatus = data.map((c: Category) => ({
				...c,
				status: c.is_active ? ('active' as const) : ('inactive' as const),
			}));
			setCategories(categoriesWithStatus);
			return categoriesWithStatus;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '활성 카테고리를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const createCategory = useCallback(
		async (categoryData: {
			name: string;
			slug: string;
			description?: string;
			sort_order?: number;
			is_active?: boolean;
		}) => {
			try {
				setLoading(true);
				setError(null);
				const newCategory = await categoryService.createCategory(categoryData);
				const categoryWithStatus = {
					...newCategory,
					status: newCategory.is_active ? ('active' as const) : ('inactive' as const),
				};
				setCategories((prev) => [...prev, categoryWithStatus]);
				return categoryWithStatus;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '카테고리 생성에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const updateCategory = useCallback(async (id: string, categoryData: Partial<Category>) => {
		try {
			setLoading(true);
			setError(null);
			const updatedCategory = await categoryService.updateCategory(id, categoryData);
			const categoryWithStatus = {
				...updatedCategory,
				status: updatedCategory.is_active ? ('active' as const) : ('inactive' as const),
			};
			setCategories((prev) => prev.map((cat) => (cat.id === id ? categoryWithStatus : cat)));
			return categoryWithStatus;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '카테고리 수정에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateCategoryStatus = useCallback(async (id: string, isActive: boolean) => {
		try {
			setLoading(true);
			setError(null);
			const updatedCategory = await categoryService.updateCategoryStatus(id, isActive);
			const categoryWithStatus = {
				...updatedCategory,
				status: updatedCategory.is_active ? ('active' as const) : ('inactive' as const),
			};
			setCategories((prev) => prev.map((cat) => (cat.id === id ? categoryWithStatus : cat)));
			return categoryWithStatus;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '카테고리 상태 변경에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const bulkUpdateStatus = useCallback(
		async (categoryIds: string[], isActive: boolean) => {
			try {
				setLoading(true);
				setError(null);
				await categoryService.bulkUpdateStatus(categoryIds, isActive);
				// 상태 업데이트 후 전체 데이터 다시 로드
				await fetchCategories();
				return categoryIds.length;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '카테고리 일괄 상태 변경에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchCategories]
	);

	const deleteCategory = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			await categoryService.deleteCategory(id);
			setCategories((prev) => prev.filter((cat) => cat.id !== id));
			setTotalCategories((prev) => prev - 1);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '카테고리 삭제에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const clearError = useCallback(() => setError(null), []);

	return {
		categories,
		loading,
		error,
		totalCategories,
		stats,
		fetchCategories,
		fetchActiveCategories,
		createCategory,
		updateCategory,
		updateCategoryStatus,
		bulkUpdateStatus,
		deleteCategory,
		clearError,
	};
};

import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '../api/category.service';
import type { Category, CategoryFilters } from '../api/category.service';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 자동으로 활성 카테고리 로드
    useEffect(() => {
        fetchActiveCategories();
    }, []);

    const fetchCategories = useCallback(async (filters?: CategoryFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await categoryService.getCategories(filters);
            setCategories(response.categories);
            return response;
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
            setCategories(data);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '활성 카테고리를 불러오는데 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = useCallback(
        async (categoryData: { name: string; slug: string; description?: string; sort_order?: number; is_active?: boolean }) => {
            try {
                setLoading(true);
                setError(null);
                const newCategory = await categoryService.createCategory(categoryData);
                setCategories((prev) => [...prev, newCategory]);
                return newCategory;
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
            setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
            return updatedCategory;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '카테고리 수정에 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await categoryService.deleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
        fetchCategories,
        fetchActiveCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        clearError,
    };
};

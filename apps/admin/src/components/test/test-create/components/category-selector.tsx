import React, { useEffect, useState } from 'react';
import { categoryService, Category } from '../../../../api/category.service';
import { CategorySelectorProps } from '../types';

const CategoryButton = ({ category, isSelected, onToggle }: { category: Category; isSelected: boolean; onToggle: () => void }) => (
    <button
        onClick={onToggle}
        className={`p-3 border rounded-lg text-left transition-all ${
            isSelected ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-gray-300'
        }`}
    >
        <span className="text-sm font-medium">{category.name}</span>
    </button>
);

export function CategorySelector({ selectedCategoryIds, onCategoryToggle }: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService
            .getActiveCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <label className="text-base font-medium block">
                카테고리 <span className="text-red-500">*</span>
            </label>
            {loading ? (
                <div className="text-center py-4 text-gray-500 mt-2">카테고리를 불러오는 중...</div>
            ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category) => (
                        <CategoryButton
                            key={category.id}
                            category={category}
                            isSelected={selectedCategoryIds.includes(category.id)}
                            onToggle={() => onCategoryToggle(category.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

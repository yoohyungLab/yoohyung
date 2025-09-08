'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
    { id: 'all', name: '전체', count: 0 },
    { id: 'personality', name: '성격', count: 12 },
    { id: 'relationship', name: '연애', count: 8 },
    { id: 'career', name: '진로', count: 6 },
    { id: 'hobby', name: '취미', count: 4 },
    { id: 'lifestyle', name: '라이프스타일', count: 10 },
];

export function CategoryFilter() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const router = useRouter();

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        if (categoryId === 'all') {
            router.push('/tests');
        } else {
            router.push(`/tests?category=${categoryId}`);
        }
    };

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리별 탐색</h2>
            <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-6 py-3 rounded-full font-medium transition-colors ${
                            selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                        {category.count > 0 && <span className="ml-2 text-sm opacity-75">({category.count})</span>}
                    </button>
                ))}
            </div>
        </section>
    );
}

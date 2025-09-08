'use client';

import { HomeCard } from '@/shared/ui/cards/home-card';
import { useFavorites } from '@/shared/hooks/use-favorites';

interface BalanceGameSectionProps {}

export function CategoryFilter() {
    return (
        <section className="space-y-4 mt-12">
            <h2 className="text-xl font-bold text-gray-900">📂 카테고리로 찾기</h2>
            <div className="flex flex-wrap gap-2">
                {['전체', '성격', '연애', '감정'].map((category) => (
                    <button
                        key={category}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-pink-100 text-gray-700 rounded-full transition"
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}

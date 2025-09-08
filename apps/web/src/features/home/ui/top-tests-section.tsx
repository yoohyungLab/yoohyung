'use client';

import { HomeCard } from '@/shared/ui/cards/home-card';
import { useFavorites } from '@/shared/hooks/use-favorites';

interface TopTestsSectionProps {
    tests: Array<{
        id: string;
        title: string;
        image: string;
        tag: string;
    }>;
}

export function TopTestsSection({ tests }: TopTestsSectionProps) {
    const { isFavorite, toggleFavorite } = useFavorites();

    return (
        <section className="space-y-4 mt-12">
            <h2 className="text-xl font-bold text-gray-900">🌟 유형별 TOP 테스트</h2>
            <div className="grid grid-cols-2 gap-2">
                {tests.map((test) => (
                    <HomeCard
                        key={test.id}
                        id={test.id}
                        title={test.title}
                        image={test.image}
                        tag={test.tag}
                        isFavorite={isFavorite(test.id)}
                        onToggleFavorite={toggleFavorite}
                    />
                ))}
                {/* 아이템 수가 홀수라면 마지막에 빈 블록 추가해서 정렬 유지 */}
                {tests.length % 2 !== 0 && <div className="hidden sm:block" />}
            </div>
        </section>
    );
}

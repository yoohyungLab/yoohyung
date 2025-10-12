'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button, DefaultSelect } from '@pickid/ui';
import { CheckCircle, Eye } from 'lucide-react';
import type { Category } from '@pickid/supabase';

interface CategoryTestItem {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string | null;
	completions?: number; // 완료 횟수 (결과 완료)
	createdAt?: string;
	starts?: number; // 시작 횟수 ("시작하기" 버튼 클릭)
}

interface CategoryPageProps {
	category: Category;
	tests: CategoryTestItem[];
	allCategories: Category[];
}

// 추후 카테고리별 그라데이션 적용 시 사용 예정
// const CATEGORY_GRADIENTS: Record<string, string> = {
// 	all: 'from-gray-600 to-gray-700',
// 	personality: 'from-violet-500 to-purple-600',
// 	typetype: 'from-indigo-500 to-blue-600',
// 	category: 'from-pink-500 to-rose-600',
// 	'category-1': 'from-amber-500 to-orange-600',
// 	'category-2': 'from-emerald-500 to-teal-600',
// 	'category-3': 'from-cyan-500 to-blue-500',
// 	test: 'from-fuchsia-500 to-pink-600',
// 	tendency: 'from-red-500 to-rose-600',
// 	'test-1': 'from-lime-500 to-green-600',
// 	'category-4': 'from-sky-500 to-blue-600',
// 	psychologypsychology: 'from-purple-500 to-violet-600',
// 	'category-5': 'from-slate-500 to-gray-600',
// 	'category-6': 'from-orange-500 to-red-600',
// };

export function CategoryPage({ tests, allCategories }: CategoryPageProps) {
	const router = useRouter();
	const params = useParams();
	const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'starts'>('popular');

	const currentSlug = params?.slug as string;

	// 정렬된 테스트
	const sortedTests = [...tests].sort((a, b) => {
		if (sortBy === 'popular') return (b.completions || 0) - (a.completions || 0);
		if (sortBy === 'recent') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
		if (sortBy === 'starts') return (b.starts || 0) - (a.starts || 0);
		return 0;
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* 헤더 */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 py-4">
					{/* 카테고리 네비게이션 */}
					<div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
						<div className="flex gap-2">
							{allCategories.map((cat) => {
								const isActive = cat.slug === currentSlug;
								return (
									<Button
										key={cat.id}
										variant={isActive ? 'default' : 'outline'}
										size="sm"
										onClick={() => router.push(`/category/${cat.slug}`)}
										className="whitespace-nowrap flex-shrink-0"
									>
										{cat.name}
									</Button>
								);
							})}
						</div>
					</div>
				</div>
			</header>

			{/* 메인 콘텐츠 */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				{/* 정렬/카운트 */}
				<div className="flex items-center justify-between mb-6">
					<div className="text-sm text-gray-600">총 {sortedTests.length.toLocaleString()}개</div>
					<div className="w-40">
						<DefaultSelect
							value={sortBy}
							onValueChange={(v) => setSortBy(v as typeof sortBy)}
							options={[
								{ value: 'popular', label: '인기순(완료)' },
								{ value: 'recent', label: '최신순' },
								{ value: 'starts', label: '시작순' },
							]}
							placeholder="정렬 선택"
							size="sm"
							variant="default"
						/>
					</div>
				</div>

				{/* 테스트 그리드 */}
				{sortedTests.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{sortedTests.map((test) => (
							<button
								key={test.id}
								onClick={() => router.push(`/tests/${test.id}`)}
								className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
							>
								{test.thumbnailUrl && (
									<div className="relative w-full aspect-[4/3]">
										<Image
											src={test.thumbnailUrl}
											alt={test.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform"
										/>
									</div>
								)}
								<div className="p-4">
									<h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{test.title}</h3>
									{test.description && (
										<p className="text-xs text-gray-600 whitespace-pre-line line-clamp-2 mb-3">{test.description}</p>
									)}
									<div className="flex items-center justify-end gap-2 text-xs text-gray-500">
										<div className="flex items-center gap-1">
											<CheckCircle className="w-3.5 h-3.5" />
											<span>{(test.completions || 0).toLocaleString()}</span>
										</div>
										{test.starts !== undefined && (
											<div className="flex items-center gap-1">
												<Eye className="w-3.5 h-3.5" />
												<span>{test.starts.toLocaleString()}</span>
											</div>
										)}
									</div>
								</div>
							</button>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="text-4xl mb-4">🔍</div>
						<p className="text-gray-600">아직 테스트가 없어요</p>
					</div>
				)}
			</main>
		</div>
	);
}

export default CategoryPage;

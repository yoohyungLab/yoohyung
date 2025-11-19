import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryContainer } from '@/features/category/ui/category-container';
import { categoryService } from '@/shared/api/services/category.service';
import { generatePageMetadata } from '@/shared/lib/metadata';
import type { ITestItem } from '@/features/category/ui/category-card';

export const metadata: Metadata = generatePageMetadata({
	title: '카테고리별 테스트',
	description: '관심사별로 다양한 심리테스트를 찾아보세요. MBTI, 성격분석, 재미있는 밸런스게임까지!',
	path: '/category',
});

export default async function CategoryPage() {
	try {
		const allCategoryData = await categoryService.getAllCategoriesDataSSR();
		if (!allCategoryData) notFound();

		const { allCategories, allTests } = allCategoryData;
		const transformedTests = categoryService.transformTestData(allTests) as ITestItem[];

		return (
			<Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
				<CategoryContainer allTests={transformedTests} allCategories={allCategories} />
			</Suspense>
		);
	} catch (error) {
		console.error('카테고리 페이지 로드 실패:', error);
		notFound();
	}
}

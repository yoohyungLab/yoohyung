import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { popularService } from '@/api/services/popular.service';
import { CategoryContainer } from '@/app/category/components/category-container';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
	title: '인기 테스트',
	description: '지금 가장 많이 하는 심리테스트! 인기 테스트 TOP 50을 만나보세요.',
	path: '/popular',
});

export default async function PopularPage() {
	try {
		const { tests, categories } = await popularService.getPopularPageData();
		return (
			<Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
				<CategoryContainer allTests={tests} allCategories={categories} />
			</Suspense>
		);
	} catch (error) {
		console.error('인기 페이지 데이터 로드 실패:', error);
		notFound();
	}
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { popularService } from '@/shared/api/services/popular.service';
import { CategoryContainer } from '@/features/category/ui/category-container';
import { generatePageMetadata } from '@/shared/lib/metadata';
import type { Category } from '@pickid/supabase';

export const metadata: Metadata = generatePageMetadata({
	title: '인기 테스트',
	description: '지금 가장 많이 하는 심리테스트! 인기 테스트 TOP 50을 만나보세요.',
	path: '/popular',
});

export default async function PopularPage() {
	try {
		const { tests, categories } = await popularService.getPopularPageData();
		return <CategoryContainer allTests={tests} allCategories={categories as Category[]} />;
	} catch (error) {
		console.error('인기 페이지 데이터 로드 실패:', error);
		notFound();
	}
}

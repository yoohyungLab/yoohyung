import { Metadata } from 'next';
import { CategoryContainer } from '@/features/category/ui/category-container';
import { categoryService } from '@/shared/api/services/category.service';
import { generatePageMetadata } from '@/shared/lib/metadata';
import { ErrorMessage } from '@pickid/ui';

export const metadata: Metadata = generatePageMetadata({
	title: '카테고리별 테스트',
	description: '관심사별로 다양한 심리테스트를 찾아보세요. MBTI, 성격분석, 재미있는 밸런스게임까지!',
	path: '/category',
});

export default async function CategoryPage() {
	try {
		const allCategoryData = await categoryService.getAllCategoriesDataSSR();

		if (!allCategoryData) {
			return (
				<ErrorMessage
					errorType="server"
					variant="page"
					onGoHome={() => (window.location.href = '/')}
					onGoBack={() => window.history.back()}
				/>
			);
		}

		const { allCategories, allTests } = allCategoryData;
		const transformedTests = categoryService.transformTestData(allTests);

		return <CategoryContainer allTests={transformedTests} allCategories={allCategories} />;
	} catch (error) {
		console.error('카테고리 페이지 로드 실패:', error);
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">문제가 발생했어요</h1>
					<p className="text-gray-600 mb-4">요청을 처리하는 중 문제가 발생했습니다</p>
					<div className="space-x-4">
						<button
							onClick={() => window.history.back()}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
						>
							뒤로가기
						</button>
						<button
							onClick={() => (window.location.href = '/')}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							홈으로
						</button>
					</div>
				</div>
			</div>
		);
	}
}

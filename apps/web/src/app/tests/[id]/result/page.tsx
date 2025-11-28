import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testService } from '@/api/services/test.service';
import { SITE_CONFIG } from '@/constants/site-config';
import { TestResultPageClient } from '@/app/tests/components/test-result-page-client';

interface IPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata({ params, searchParams }: IPageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const { ref } = await searchParams;
		const isSharedLink = ref === 'share';

		const test = await testService.getTestById(id);

		if (!test) {
			return {
				title: '테스트 결과',
				description: '심리테스트 결과를 확인해보세요.',
			};
		}

		const testName = (test.title as string) || '테스트';
		const testDescription = (test.description as string) || '심리테스트 결과를 확인해보세요.';
		const title = isSharedLink ? `${testName} 친구 결과` : `${testName} 결과`;
		const description = isSharedLink
			? `친구가 ${testName} 결과를 공유했어요! 나도 테스트해보세요.`
			: `${testDescription} 나도 테스트하기 →`;
		const ogImage = (test.thumbnail_url as string) || undefined;

		return {
			title,
			description,
			keywords: [...SITE_CONFIG.keywords, testName, test.type === 'balance' ? '밸런스게임' : '심리테스트'],
			...(ogImage && {
				openGraph: {
					images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
				},
			}),
			...(isSharedLink && {
				robots: {
					index: false,
					follow: true,
				},
			}),
		};
	} catch (error) {
		console.error('메타데이터 생성 실패:', error);
		return {
			title: '테스트 결과',
			description: '심리테스트 결과를 확인해보세요.',
		};
	}
}

export default async function TestResultPage({ params }: IPageProps) {
	const { id } = await params;

	try {
		const test = await testService.getTestById(id);

		if (!test) {
			notFound();
		}

		const testType = (test.type as string) || 'psychology';

		return <TestResultPageClient testId={id} testType={testType} />;
	} catch (error) {
		console.error('테스트 정보 로드 실패:', error);
		notFound();
	}
}

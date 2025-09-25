import { MetadataRoute } from 'next';
import { MAIN_TESTS } from '@/shared/constants';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://typologylab.com';

	// 정적 페이지들
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/tests`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/feedback`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/auth/login`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/auth/register`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		},
	];

	// 테스트 페이지들
	const testPages = MAIN_TESTS.map((test) => ({
		url: `${baseUrl}/tests/${test.id}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: 0.7,
	}));

	// 결과 페이지들 (동적 생성)
	const resultPages = MAIN_TESTS.flatMap((test) => [
		{
			url: `${baseUrl}/tests/${test.id}/result`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.6,
		},
	]);

	return [...staticPages, ...testPages, ...resultPages];
}

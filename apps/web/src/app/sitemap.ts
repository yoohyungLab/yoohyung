import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://pickid.com';

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
		{
			url: `${baseUrl}/balance-game`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
	];

	// TODO: 실제 테스트 데이터를 가져와서 동적으로 생성하도록 수정 필요
	// 현재는 정적 페이지만 반환
	return staticPages;
}

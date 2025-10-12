import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://pickid.co.kr';

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${baseUrl}/tests`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/mypage`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/feedback`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	];
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/api/', '/auth/'],
		},
		sitemap: 'https://pickid.co.kr/sitemap.xml',
	};
}

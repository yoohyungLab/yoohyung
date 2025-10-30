/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
	generateRobotsTxt: true,
	generateIndexSitemap: false,
	exclude: ['/admin/*', '/api/*', '/auth/*'],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/admin/', '/api/', '/auth/'],
			},
		],
		additionalSitemaps: ['https://pickid.co.kr/sitemap.xml'],
	},
	additionalPaths: async (config) => {
		const result = [];
		
		try {
			// 동적 경로는 빌드 시점에 생성하지 않고 정적 경로만 사용
			// 실제 동적 경로는 런타임에 생성됨
		} catch (error) {
			console.error('Error generating additional sitemap paths:', error);
		}
		
		return result;
	},
	transform: async (config, path) => {
		// 동적 페이지 우선순위 설정
		const priority = (() => {
			if (path === '/') return 1.0;
			if (path.startsWith('/tests/')) return 0.8;
			if (path.startsWith('/category/')) return 0.8;
			if (path === '/mypage') return 0.6;
			if (path === '/feedback') return 0.5;
			return 0.7;
		})();

		// 변경 빈도 설정
		const changefreq = (() => {
			if (path === '/') return 'daily';
			if (path.startsWith('/tests/')) return 'weekly';
			if (path.startsWith('/category/')) return 'weekly';
			if (path === '/mypage') return 'monthly';
			return 'weekly';
		})();

		return {
			loc: path,
			changefreq,
			priority,
			lastmod: new Date().toISOString(),
		};
	},
};

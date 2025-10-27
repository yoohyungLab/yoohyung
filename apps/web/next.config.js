/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@pickid/ui', '@pickid/shared', '@pickid/supabase', '@pickid/types'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.supabase.co',
			},
		],
		formats: ['image/webp'],
	},
	// 개발 환경에서 소스맵 활성화
	productionBrowserSourceMaps: true,
	// 캐시 설정
	onDemandEntries: {
		// 개발 시 페이지 유지 시간
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},
	// TypeScript 설정
	typescript: {
		ignoreBuildErrors: false,
	},
	// ESLint 설정
	eslint: {
		ignoreDuringBuilds: false,
	},
	// 웹팩 설정
	webpack: (config, { dev, isServer }) => {
		// 개발 환경에서 HMR 최적화
		if (dev && !isServer) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
			};
		}
		return config;
	},
	async rewrites() {
		return [];
	},
};

module.exports = nextConfig;

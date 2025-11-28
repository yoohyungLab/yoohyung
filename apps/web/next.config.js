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
		formats: ['image/avif', 'image/webp'],
		// 모바일 고해상도 디스플레이 최적화
		deviceSizes: [390, 435, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// 이미지 품질 기본값 (1-100)
		minimumCacheTTL: 60,
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
		// 패키지 alias 설정 (소스 파일 직접 참조)
		config.resolve.alias = {
			...config.resolve.alias,
			'@pickid/shared': require('path').resolve(__dirname, '../../packages/shared/src'),
			'@pickid/supabase': require('path').resolve(__dirname, '../../packages/supabase/src'),
			'@pickid/ui': require('path').resolve(__dirname, '../../packages/ui/src'),
		};
		// TypeScript 파일 확장자 우선순위 설정
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.jsx': ['.tsx', '.jsx'],
		};
		// 확장자 해결 순서 설정 (TypeScript 우선)
		if (!config.resolve.extensions) {
			config.resolve.extensions = [];
		}
		config.resolve.extensions = [
			'.ts',
			'.tsx',
			...config.resolve.extensions.filter((ext) => ext !== '.ts' && ext !== '.tsx'),
		];
		return config;
	},
	async rewrites() {
		return [];
	},
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@pickid/ui', '@pickid/shared', '@pickid/supabase', '@pickid/types'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.supabase.co',
			},
			// 카카오 프로필 이미지 도메인 허용
			{
				protocol: 'http',
				hostname: 'k.kakaocdn.net',
			},
			{
				protocol: 'https',
				hostname: 'k.kakaocdn.net',
			},
		],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = nextConfig;

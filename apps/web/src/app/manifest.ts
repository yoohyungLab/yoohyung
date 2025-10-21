import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/shared/config/metadata';

/**
 * PWA Manifest (동적 생성)
 * metadata.ts의 설정을 재사용하여 중복 제거
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_CONFIG.title,
		short_name: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		orientation: 'portrait',
		scope: '/',
		lang: 'ko',
		icons: [
			{
				src: '/icons/favicon.ico',
				sizes: '16x16 32x32',
				type: 'image/x-icon',
			},
			{
				src: '/icons/logo.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'maskable',
			},
		],
		categories: ['entertainment', 'lifestyle', 'social'],
	};
}

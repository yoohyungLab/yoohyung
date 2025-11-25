/**
 * 메타데이터 헬퍼 함수
 * 페이지별 메타데이터를 일관되게 생성
 */

import { Metadata } from 'next';
import { SITE_CONFIG, SOCIAL } from '@/components/config/metadata';

interface GeneratePageMetadataOptions {
	title: string;
	description?: string;
	path?: string;
	ogImage?: string;
	noIndex?: boolean;
}

/**
 * 페이지 메타데이터 생성 헬퍼
 * @param options - 메타데이터 옵션
 * @returns Metadata 객체
 */
export function generatePageMetadata(options: GeneratePageMetadataOptions): Metadata {
	const { title, description = SITE_CONFIG.description, path = '', ogImage = SITE_CONFIG.ogImage, noIndex = false } = options;

	const url = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;

	return {
		title,
		description,
		openGraph: {
			type: 'website',
			url,
			title,
			description,
			siteName: SITE_CONFIG.name,
			locale: 'ko_KR',
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title,
					type: 'image/png',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: SOCIAL.twitter,
			site: SOCIAL.twitter,
			images: [{ url: ogImage, alt: title }],
		},
		...(noIndex && {
			robots: {
				index: false,
				follow: true,
			},
		}),
	};
}


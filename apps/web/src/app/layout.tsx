// src/app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { SessionProvider } from '@/shared/providers/session.provider';
import { QueryProvider } from '@/shared/providers/query.provider';
import { GoogleAnalytics } from '@/shared/components/google-analytics';
import { SITE_CONFIG, VERIFICATION } from '@/shared/config/metadata';
import { Toaster } from '@pickid/ui';
import App from '@/App';

import './globals.css';

// 전체 사이트 공통 메타데이터 (모든 페이지에 적용)
export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.url),
	title: {
		default: SITE_CONFIG.title,
		template: '%s | 픽키드',
	},
	description: SITE_CONFIG.description,
	applicationName: SITE_CONFIG.name,
	keywords: SITE_CONFIG.keywords,
	authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
	creator: SITE_CONFIG.name,
	publisher: SITE_CONFIG.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/favicon.ico',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	...(VERIFICATION.google && {
		verification: {
			google: VERIFICATION.google,
		},
	}),
	...(VERIFICATION.naver && {
		other: {
			'naver-site-verification': VERIFICATION.naver,
		},
	}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;

	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body className="flex min-h-screen" suppressHydrationWarning>
				{gaId && <GoogleAnalytics gaId={gaId} />}

				<QueryProvider>
					<SessionProvider>
						<App>{children}</App>
					</SessionProvider>
				</QueryProvider>

				<Toaster />
			</body>
		</html>
	);
}

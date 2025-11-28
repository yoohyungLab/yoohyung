// src/app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { SessionProvider } from '@/providers/session.provider';
import { QueryClientProvider } from '@pickid/shared';
import { GoogleAnalytics } from '@/components/google-analytics';
import { SITE_CONFIG, VERIFICATION } from '@/constants/site-config';
import { Toaster } from '@pickid/ui';
import App from '@/App';
import './globals.css';

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
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		url: SITE_CONFIG.url,
		siteName: SITE_CONFIG.name,
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		images: [
			{
				url: SITE_CONFIG.ogImage,
				width: 1200,
				height: 630,
				alt: SITE_CONFIG.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		creator: '@pickid',
		images: [SITE_CONFIG.ogImage],
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
				<QueryClientProvider>
					<SessionProvider>
						<App>{children}</App>
					</SessionProvider>
				</QueryClientProvider>
				<Toaster />
				{/* <AdBannerSticky /> */}
			</body>
		</html>
	);
}

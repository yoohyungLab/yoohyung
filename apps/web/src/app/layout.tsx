// src/app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { SessionProvider } from '@/shared/providers/session.provider';
import { QueryProvider } from '@/shared/providers/query.provider';
import { GoogleAnalytics } from '@/shared/components/google-analytics';
import App from '@/App';

import './globals.css';

export const metadata: Metadata = {
	title: '픽키드 - 나를 알아가는 심리테스트',
	description: '재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요. Z세대를 위한 트렌디한 테스트 플랫폼.',
	keywords: ['심리테스트', '성격분석', '밸런스게임', 'MBTI', '자기계발', '픽키드', 'Z세대'],
	authors: [{ name: '픽키드' }],
	creator: '픽키드',
	publisher: '픽키드',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL('https://pickid.co.kr'),
	alternates: {
		canonical: '/',
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/favicon.ico',
	},
	openGraph: {
		type: 'website',
		url: 'https://pickid.co.kr',
		title: '픽키드 - 나를 알아가는 심리테스트',
		description: '재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요.',
		siteName: '픽키드',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: '픽키드 - 심리테스트 플랫폼',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: '픽키드 - 나를 알아가는 심리테스트',
		description: '재미있는 심리테스트로 나를 발견하고 친구들과 공유해보세요.',
		creator: '@pickid',
		images: ['/og-image.png'],
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
	verification: {
		google: 'your-google-verification-code',
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;

	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body className="flex min-h-screen">
				{/* Google Analytics */}
				{gaId && <GoogleAnalytics gaId={gaId} />}

				{/* ✅ QueryProvider → AuthProvider 순서 중요 (Auth가 Query 사용 가능) */}
				<QueryProvider>
					<SessionProvider>
						<App>{children}</App>
					</SessionProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

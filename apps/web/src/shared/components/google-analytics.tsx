// Google Analytics 4 스크립트 컴포넌트
import Script from 'next/script';

interface GoogleAnalyticsProps {
	gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
	return (
		<>
			{/* Google Analytics gtag.js */}
			<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
			<Script
				id="google-analytics"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${gaId}', {
							page_path: window.location.pathname,
						});
					`,
				}}
			/>
		</>
	);
}

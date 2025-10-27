import Script from 'next/script';

interface IGoogleAnalyticsProps {
	gaId: string;
}

export function GoogleAnalytics({ gaId }: IGoogleAnalyticsProps) {
	return (
		<>
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


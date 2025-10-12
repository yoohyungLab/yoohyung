'use client';

import { useEffect } from 'react';

export function StructuredDataScript() {
	useEffect(() => {
		// Organization 스키마
		const organizationSchema = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: '픽키드',
			alternateName: 'Pickid',
			url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
			logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr'}/icons/logo.svg`,
			description: '픽키드(Pickid): 성향/퍼스널리티 테스트 플랫폼',
			foundingDate: '2025',
			sameAs: [process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr'],
			contactPoint: {
				'@type': 'ContactPoint',
				email: 'alstjr9438@gmail.com',
				contactType: 'customer service',
			},
		};

		// WebSite 스키마
		const websiteSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: '픽키드',
			url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
			description: '성향/퍼스널리티 테스트는 픽키드에서',
			inLanguage: 'ko',
			potentialAction: {
				'@type': 'SearchAction',
				target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr'}/tests?search={search_term_string}`,
				'query-input': 'required name=search_term_string',
			},
		};

		// WebApplication 스키마
		const webAppSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: '픽키드',
			url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
			description: '성향/퍼스널리티 테스트 웹 애플리케이션',
			applicationCategory: 'EntertainmentApplication',
			operatingSystem: 'Web Browser',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'KRW',
			},
			author: {
				'@type': 'Organization',
				name: '픽키드',
			},
		};

		// BreadcrumbList 스키마 (홈페이지용)
		const breadcrumbSchema = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: '홈',
					item: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
				},
			],
		};

		// FAQ 스키마 (자주 묻는 질문)
		const faqSchema = {
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: '픽키드는 무엇인가요?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '픽키드는 성향/퍼스널리티 테스트 플랫폼입니다. 다양한 심리테스트를 통해 자신을 알아가고 친구들과 공유할 수 있습니다.',
					},
				},
				{
					'@type': 'Question',
					name: '테스트는 무료인가요?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '네, 모든 테스트는 무료로 이용하실 수 있습니다.',
					},
				},
				{
					'@type': 'Question',
					name: '회원가입이 필요한가요?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '회원가입 없이도 테스트를 이용하실 수 있지만, 결과 저장 및 공유를 위해서는 간편 회원가입을 권장합니다.',
					},
				},
			],
		};

		// 스키마를 DOM에 추가
		const schemas = [organizationSchema, websiteSchema, webAppSchema, breadcrumbSchema, faqSchema];

		schemas.forEach((schema) => {
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.textContent = JSON.stringify(schema);
			document.head.appendChild(script);
		});

		// 컴포넌트 언마운트 시 정리
		return () => {
			const scripts = document.querySelectorAll('script[type="application/ld+json"]');
			scripts.forEach((script) => {
				if (script.textContent?.includes('픽키드')) {
					script.remove();
				}
			});
		};
	}, []);

	return null;
}

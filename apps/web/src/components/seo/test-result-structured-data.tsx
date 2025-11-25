'use client';

import { useEffect } from 'react';

export interface ITestResultStructuredDataProps {
	testId: string;
	testTitle: string;
	resultName: string;
	resultDescription: string;
	resultImage?: string;
	totalScore?: number;
	userGender?: string;
}

export function TestResultStructuredData(props: ITestResultStructuredDataProps) {
	const { testId, testTitle, resultName, resultDescription, resultImage, totalScore, userGender } = props;

	useEffect(() => {
		const resultSchema = {
			'@context': 'https://schema.org',
			'@type': 'Quiz',
			name: `${testTitle} - ${resultName}`,
			description: resultDescription,
			url: `https://pickid.co.kr/tests/${testId}/result`,
			image: resultImage ? `https://pickid.co.kr${resultImage}` : 'https://pickid.co.kr/og-image.png',
			author: {
				'@type': 'Organization',
				name: '픽키드',
			},
			publisher: {
				'@type': 'Organization',
				name: '픽키드',
				url: 'https://pickid.co.kr',
			},
			datePublished: new Date().toISOString(),
			dateModified: new Date().toISOString(),
			inLanguage: 'ko',
			about: {
				'@type': 'Thing',
				name: '심리테스트 결과',
			},
			educationalLevel: 'beginner',
			learningResourceType: 'quiz',
			...(userGender && {
				audience: {
					'@type': 'Audience',
					name: userGender === 'male' ? '남성' : '여성',
				},
			}),
		};

		const articleSchema = {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: `${testTitle} 결과: ${resultName}`,
			description: resultDescription,
			url: `https://pickid.co.kr/tests/${testId}/result`,
			image: resultImage ? `https://pickid.co.kr${resultImage}` : 'https://pickid.co.kr/og-image.png',
			author: {
				'@type': 'Organization',
				name: '픽키드',
			},
			publisher: {
				'@type': 'Organization',
				name: '픽키드',
				url: 'https://pickid.co.kr',
				logo: {
					'@type': 'ImageObject',
					url: 'https://pickid.co.kr/icons/logo.svg',
				},
			},
			datePublished: new Date().toISOString(),
			dateModified: new Date().toISOString(),
			inLanguage: 'ko',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': `https://pickid.co.kr/tests/${testId}/result`,
			},
		};

		const breadcrumbSchema = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: '홈',
					item: 'https://pickid.co.kr',
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: '테스트',
					item: 'https://pickid.co.kr/tests',
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: testTitle,
					item: `https://pickid.co.kr/tests/${testId}`,
				},
				{
					'@type': 'ListItem',
					position: 4,
					name: '결과',
					item: `https://pickid.co.kr/tests/${testId}/result`,
				},
			],
		};

		const schemas = [resultSchema, articleSchema, breadcrumbSchema];

		schemas.forEach((schema) => {
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.textContent = JSON.stringify(schema);
			document.head.appendChild(script);
		});

		return () => {
			const scripts = document.querySelectorAll('script[type="application/ld+json"]');
			scripts.forEach((script) => {
				if (script.textContent?.includes(resultName)) {
					script.remove();
				}
			});
		};
	}, [testId, testTitle, resultName, resultDescription, resultImage, totalScore, userGender]);

	return null;
}

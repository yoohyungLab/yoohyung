'use client';

import { useEffect } from 'react';

interface TestResultStructuredDataProps {
	testId: string;
	testTitle: string;
	resultName: string;
	resultDescription: string;
	resultImage?: string;
	totalScore: number;
	userGender?: string;
}

export function TestResultStructuredData({
	testId,
	testTitle,
	resultName,
	resultDescription,
	resultImage,
	totalScore,
	userGender,
}: TestResultStructuredDataProps) {
	useEffect(() => {
		// 테스트 결과용 구조화된 데이터
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

		// Article 스키마 (결과 페이지를 기사로도 인식)
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

		// BreadcrumbList 스키마 (결과 페이지용)
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

		// 스키마를 DOM에 추가
		const schemas = [resultSchema, articleSchema, breadcrumbSchema];

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
				if (script.textContent?.includes(resultName)) {
					script.remove();
				}
			});
		};
	}, [testId, testTitle, resultName, resultDescription, resultImage, totalScore, userGender]);

	return null;
}

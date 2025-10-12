'use client';

import { useEffect } from 'react';

interface TestStructuredDataProps {
	testId: string;
	testTitle: string;
	testDescription?: string;
	testImage?: string;
	testCategory?: string;
	testDuration?: number;
	testQuestions?: number;
}

export function TestStructuredData({
	testId,
	testTitle,
	testDescription,
	testImage,
	testCategory,
	testDuration,
	testQuestions,
}: TestStructuredDataProps) {
	useEffect(() => {
		// 테스트용 구조화된 데이터
		const testSchema = {
			'@context': 'https://schema.org',
			'@type': 'Quiz',
			name: testTitle,
			description: testDescription || `${testTitle} 심리테스트`,
			url: `https://pickid.co.kr/tests/${testId}`,
			image: testImage ? `https://pickid.co.kr${testImage}` : 'https://pickid.co.kr/og-image.png',
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
				name: testCategory || '심리테스트',
			},
			...(testDuration && {
				timeRequired: `PT${testDuration}M`,
			}),
			...(testQuestions && {
				numberOfQuestions: testQuestions,
			}),
			educationalLevel: 'beginner',
			learningResourceType: 'quiz',
		};

		// BreadcrumbList 스키마 (테스트 페이지용)
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
			],
		};

		// 스키마를 DOM에 추가
		const schemas = [testSchema, breadcrumbSchema];

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
				if (script.textContent?.includes(testId)) {
					script.remove();
				}
			});
		};
	}, [testId, testTitle, testDescription, testImage, testCategory, testDuration, testQuestions]);

	return null;
}

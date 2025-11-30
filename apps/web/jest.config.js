const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Next.js 앱의 경로를 제공
	dir: './',
});

// Jest에 추가할 커스텀 설정
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@pickid/(.*)$': '<rootDir>/../../packages/$1/src',
	},
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/**/index.{js,jsx,ts,tsx}',
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
	testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
};

// createJestConfig는 비동기이므로 next/jest가 Next.js 설정을 로드할 수 있게 함
module.exports = createJestConfig(customJestConfig);

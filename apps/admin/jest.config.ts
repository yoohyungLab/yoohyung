import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapping: {
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
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;

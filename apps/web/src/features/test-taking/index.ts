// UI Components
export { TestTakingInterface } from './ui/test-taking-interface';

// Hooks
export { useTestTakingVM, useTestResultVM } from './hooks';

// Types (re-export from shared)
export type {
	TestProgress,
	TestAnswer,
	TestCompletionResult,
	TestTakingInterfaceProps,
	UseTestTakingReturn,
	TestConfig,
} from '@/shared/types';

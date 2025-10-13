// UI layer exports - 프레젠테이션 컴포넌트
export { TestContainer } from './test-container';
export { TestIntro } from './test-intro';
export { TestQuestion } from './test-question';
export { ResultLoading } from './result-loading';
export { StartButton } from './start-button';
export { GenderSelectModal } from './gender-select-modal';
export { TestLoading } from './test-loading';
export { TestResultContainer } from './test-result-container';
export { TestResultHeader } from './test-result-header';
export { TestResultContent } from './test-result-content';
export { TestResultActions } from './test-result-actions';
export { TestResultLoading, TestResultError } from './test-result-states';

// Legacy exports (하위 호환성)
export { TestContainer as TestTakingInterface } from './test-container';
export { TestContainer as TestFlow } from './test-container';

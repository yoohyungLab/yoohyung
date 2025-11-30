import type { Test, TestStatus } from '@pickid/supabase';

// TODO: 필터 supabase에서 가져오기
export interface TestFilters {
	search: string;
	status: 'all' | TestStatus;
}

export interface TestStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	archived: number;
	responses: number;
}

export type TabType = 'basic' | 'questions' | 'results' | 'stats' | 'preview';

export interface TestDetailModalProps {
	test: Test;
	onClose: () => void;
	onTogglePublish: (testId: string, currentStatus: boolean) => void;
	onDelete: (testId: string) => void;
}

export interface FeatureInput {
	key: string;
	value: string;
}

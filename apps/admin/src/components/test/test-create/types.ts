import type { Test, TestStatus, TestType, TestQuestion, TestChoice, TestResult } from '@pickid/supabase';

// =================================================================
// 테스트 생성/수정 폼에서 사용되는 중앙화된 타입 정의
// =================================================================

// Step 1: 기본 정보 폼
// -----------------------------------------------------------------

// DB의 Test 타입을 기반으로, 폼에서 사용하는 필드를 Omit/Pick 하여 새로운 타입 생성
export type TestFormBasicInfo = Omit<
	Test,
	| 'id'
	| 'created_at'
	| 'updated_at'
	| 'response_count'
	| 'start_count'
	| 'completion_count'
	| 'author_id'
	| 'tags'
	| 'share_count'
	| 'banner_image_url'
	| 'og_image_url'
	| 'is_male'
> & {
	id?: string; // 수정 모드에서 사용
	category_ids: string[];
	short_code: string;
	estimated_time?: number;
	status?: TestStatus;
	type?: TestType;
	max_score?: number;
	scheduled_at?: string | null;
	requires_gender?: boolean;
	features?: TestFeatures;
};

// 컴포넌트 Props
export interface BasicInfoFormProps {
	testData: TestFormBasicInfo;
	selectedType: string;
	onUpdateTestData: (data: Partial<TestFormBasicInfo>) => void;
	onUpdateTitle: (title: string) => void;
	onRegenerateShortCode?: () => void;
}

export interface CategorySelectorProps {
	selectedCategoryIds: string[];
	onCategoryToggle: (categoryId: string) => void;
}

export interface ThumbnailUploadProps {
	thumbnailUrl: string;
	onUpdateThumbnail: (url: string) => void;
}

// Step 2: 질문 폼
// -----------------------------------------------------------------

// DB의 TestQuestion 타입을 기반으로 폼에서 사용하는 질문 타입 정의
export type TestFormQuestion = Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> & {
	question_type?: string | null;
	correct_answers?: string[] | null;
	explanation?: string | null;
	choices: TestFormChoice[];
};

// DB의 TestChoice 타입을 기반으로 폼에서 사용하는 선택지 타입 정의
export type TestFormChoice = Omit<TestChoice, 'id' | 'question_id' | 'created_at' | 'code'> & {
	id?: string; // 프론트엔드에서 생성하는 임시 ID일 수 있음
	is_correct?: boolean | null;
	code?: string | null;
};

// Step 3: 결과 폼
// -----------------------------------------------------------------

// DB의 TestResult 타입을 기반으로 폼에서 사용하는 결과 타입 정의
export type TestFormResult = Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at' | 'match_conditions'> & {
	match_conditions: ({ type: 'score'; min: number; max: number } | { type: 'code'; codes: string[] }) | null;
	target_gender: string | null;
};

// 컴포넌트 Props
export interface ResultStepProps {
	results: TestFormResult[];
	selectedType: string;
	onAddResult: () => void;
	onRemoveResult: (resultIndex: number) => void;
	onUpdateResult: (resultIndex: number, updates: Partial<TestFormResult>) => void;
}

// 전체 폼의 값 구조
// -----------------------------------------------------------------

export interface TestFormValues {
	type: string | null;
	basicInfo: TestFormBasicInfo;
	questions: TestFormQuestion[];
	results: TestFormResult[];
}


// 기타 유틸리티 타입 (폼 기능 관련)
// -----------------------------------------------------------------

export interface ImageUploadProps {
	imageUrl: string;
	onUpdateImage: (url: string) => void;
	desc?: string;
	label?: string;
}

export interface GenderField {
	key: string;
	label: string;
	type: 'single_select';
	required: boolean;
	choices: Array<{ value: string; label: string }>;
	affects_scoring: boolean;
}

export interface ResultVariantRules {
	variant_key: string;
	map: Record<string, Record<string, string>>;
}

export interface TestFeatures {
	scoring?: {
		mode: 'score_range';
		max_score: number;
		base_types: string[];
	};
	result_variant_rules?: ResultVariantRules;
	gender_field?: GenderField;
}

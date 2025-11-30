import type { Test, TestStatus, TestType, TestQuestion, TestChoice, TestResult } from '@pickid/supabase';



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
	id?: string;
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


export type TestFormQuestion = Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> & {
	question_type?: string | null;
	correct_answers?: string[] | null;
	explanation?: string | null;
	choices: TestFormChoice[];
};

export type TestFormChoice = Omit<TestChoice, 'id' | 'question_id' | 'created_at' | 'code'> & {
	id?: string;
	is_correct?: boolean | null;
	code?: string | null;
};


export type TestFormResult = Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at' | 'match_conditions'> & {
	match_conditions: ({ type: 'score'; min: number; max: number } | { type: 'code'; codes: string[] }) | null;
	target_gender: string | null;
};

export interface ResultStepProps {
	results: TestFormResult[];
	selectedType: string;
	onAddResult: () => void;
	onRemoveResult: (resultIndex: number) => void;
	onUpdateResult: (resultIndex: number, updates: Partial<TestFormResult>) => void;
}


export interface TestFormValues {
	type: string | null;
	basicInfo: TestFormBasicInfo;
	questions: TestFormQuestion[];
	results: TestFormResult[];
}



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

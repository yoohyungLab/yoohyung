import type { Test, TestStatus, TestType } from '@pickid/supabase';

// 프론트엔드에서 사용하는 BasicInfo 타입
export interface BasicInfo
	extends Omit<
		Test,
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
	> {
	id?: string; // 수정 모드에서 사용
	category_ids: string[]; // 프론트엔드에서 사용하는 복수형
	short_code: string; // 프론트엔드에서 사용하는 필드
	estimated_time?: number;
	status?: TestStatus;
	type?: TestType;
	max_score?: number;
	scheduled_at?: string | null;
	// 성별 필드 관련
	requires_gender?: boolean;
	features?: TestFeatures;
}

export interface BasicInfoFormProps {
	testData: BasicInfo;
	selectedType: string;
	onUpdateTestData: (data: Partial<BasicInfo>) => void;
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

export interface ImageUploadProps {
	imageUrl: string;
	onUpdateImage: (url: string) => void;
	desc?: string; // 설명 텍스트를 선택적으로 받을 수 있도록 추가
	label?: string; // 라벨을 선택적으로 받을 수 있도록 추가
}

// 성별 필드 관련 타입 정의
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

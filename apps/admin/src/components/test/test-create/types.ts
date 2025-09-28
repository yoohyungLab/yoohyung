import type { Test } from '@repo/supabase';

// 프론트엔드에서 사용하는 BasicInfo 타입
export interface BasicInfo
	extends Omit<
		Test,
		| 'created_at'
		| 'updated_at'
		| 'response_count'
		| 'view_count'
		| 'completion_count'
		| 'author_id'
		| 'tags'
		| 'share_count'
		| 'banner_image_url'
		| 'og_image_url'
	> {
	id?: string; // 수정 모드에서 사용
	category_ids: string[]; // 프론트엔드에서 사용하는 복수형
	short_code: string; // 프론트엔드에서 사용하는 필드
	estimated_time?: number;
	status?: 'draft' | 'published';
	type?: string;
	max_score?: number;
	scheduled_at?: string | null;
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

// TODO: 타입 정의

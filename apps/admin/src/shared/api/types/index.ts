// User types
export * from './user.types';

// Test types
export * from './test.types';

// Feedback types
export * from './feedback.types';

// Category types
export * from './category.types';

// Admin types
export interface AdminUser {
	id: string;
	username: string;
	email: string | null;
	name: string;
	is_active: boolean | null;
	created_at: string | null;
	updated_at: string | null;
}

// admin에 type이 정의되어 있는게 여러개 있는데 supabase에서 이미 타입을 가져오고 있는데 왜 정의하고 있는거야? 별도로 만든 객체나 값이 아니면 무조건 supabase쓰고 이것도 필요하면 omit이나 Extend로 써야해줘
// supabase로 타입 최신화먼저 한뒤에 타입관련 파일들도 전체적으로 싹 깔끔하게 개선한번 하자
// 20년차의 내공을 보여줘

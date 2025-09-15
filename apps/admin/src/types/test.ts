// Admin 전용 타입들은 packages/supabase/types에서 가져와서 사용
// 필요한 경우에만 여기서 확장 타입 정의

// Re-export all types from packages/supabase for convenience
export type * from '@repo/supabase/types';
export type * from '@repo/supabase/types/admin';

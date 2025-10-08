// 인증 관련 타입 정의
import type { User, Session } from '@supabase/supabase-js';

// 인증 상태 타입
export interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	isAuthenticated: boolean;
}

// 인증 메서드 타입
export interface AuthMethods {
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name?: string) => Promise<void>;
	logout: () => Promise<void>;
	signInWithKakao: () => Promise<void>;
	refreshSession: () => Promise<void>;
}

// 인증 컨텍스트 타입
export interface AuthContextType extends AuthState, AuthMethods {}

// 인증 폼 데이터 타입
export interface AuthFormData {
	email: string;
	password: string;
	name?: string;
	confirmPassword?: string;
}

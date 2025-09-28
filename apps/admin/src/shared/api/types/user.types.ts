// User 관련 타입들을 supabase에서 가져옴
export type {
	User,
	UserInsert,
	UserUpdate,
	UserWithActivity,
	UserActivityItem,
	UserActivityStats,
	UserFilters,
	UserStatus,
	Feedback,
} from '@repo/supabase';

// React 타입 import
import type { ReactNode } from 'react';

// UserStats는 admin에서만 사용하므로 여기서 정의
export interface UserStats {
	total: number;
	active: number;
	inactive: number;
	deleted: number;
	today: number;
	this_week: number;
	this_month: number;
	email_signups: number;
	google_signups: number;
	kakao_signups: number;
}

// ViewModel 관련 타입들
export interface UserViewModelState {
	users: import('@repo/supabase').User[];
	stats: UserStats;
	loading: boolean;
	error: string | null;
}

export interface UserViewModelActions {
	loadUsers: (filters?: import('@repo/supabase').UserFilters) => Promise<void>;
	loadStats: () => Promise<void>;
	updateUserStatus: (id: string, status: 'active' | 'inactive' | 'deleted') => Promise<void>;
	bulkUpdateStatus: (ids: string[], status: 'active' | 'inactive' | 'deleted') => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
	getUserById: (id: string) => Promise<import('@repo/supabase').User>;
	refresh: () => Promise<void>;
}

// Service 관련 타입들
export interface UserServiceFilters {
	status?: 'active' | 'inactive' | 'deleted';
	provider?: 'email' | 'google' | 'kakao';
	search?: string;
}

export interface UserCreateData {
	email: string;
	name?: string;
	avatar_url?: string;
	provider?: string;
	status?: string;
}

// UI 관련 타입들
export interface UserTableColumn {
	id: string;
	header: string;
	accessorKey?: string;
	cell?: (props: unknown) => ReactNode;
}

export interface UserBulkAction {
	id: string;
	label: string;
	variant?: 'default' | 'destructive';
	onClick: () => void;
}

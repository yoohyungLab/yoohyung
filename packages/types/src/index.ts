// Place domain/shared types here
export type Brand<T, U> = T & { __brand: U };

// 대시보드 관련 타입들
export interface DashboardAlert {
	id: string;
	type: 'error' | 'warning' | 'success' | 'info';
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
	created_at: string;
}



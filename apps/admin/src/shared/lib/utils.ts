import {
	PROFILE_PROVIDER_LABELS,
	PROFILE_STATUS,
	FEEDBACK_STATUS_LABELS,
	FEEDBACK_STATUS_COLORS,
	FEEDBACK_CATEGORY_LABELS,
} from './constants';

// 간단한 cn 함수
export const cn = (...classes: (string | undefined | null | false)[]) => {
	return classes.filter(Boolean).join(' ');
};

// 상태 텍스트 가져오기 (아이콘 포함)
export const getStatusText = (status: string) => {
	return FEEDBACK_STATUS_LABELS[status as keyof typeof FEEDBACK_STATUS_LABELS] || status;
};

// 상태 색상 가져오기
export const getStatusColor = (status: string) => {
	return FEEDBACK_STATUS_COLORS[status as keyof typeof FEEDBACK_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
};

// 카테고리 텍스트 가져오기 (아이콘 포함)
export const getCategoryText = (category: string) => {
	return FEEDBACK_CATEGORY_LABELS[category as keyof typeof FEEDBACK_CATEGORY_LABELS] || category;
};

// 통합된 상태 설정 객체 (사용자용)
export const getUserStatusConfig = (status: string) => {
	switch (status) {
		case PROFILE_STATUS.ACTIVE:
			return {
				text: '활성',
				color: 'bg-emerald-500 text-white',
			};
		case PROFILE_STATUS.INACTIVE:
			return {
				text: '비활성',
				color: 'bg-slate-500 text-white',
			};
		case PROFILE_STATUS.DELETED:
			return {
				text: '탈퇴',
				color: 'bg-rose-500 text-white',
			};
		default:
			return {
				text: '알수없음',
				color: 'bg-gray-500 text-white',
			};
	}
};

export const getProviderText = (provider: string) => {
	return PROFILE_PROVIDER_LABELS[provider as keyof typeof PROFILE_PROVIDER_LABELS] || '이메일';
};

// 피드백 상태에 따른 뱃지 variant 가져오기
export const getStatusBadgeVariant = (
	status: string
): 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' => {
	switch (status) {
		case 'pending':
			return 'warning';
		case 'in_progress':
			return 'info';
		case 'completed':
			return 'success';
		case 'replied':
			return 'secondary';
		case 'rejected':
			return 'destructive';
		default:
			return 'default';
	}
};

// 피드백 상태에 따른 커스텀 스타일 가져오기 (더 구체적인 색상)
export const getFeedbackStatusStyle = (status: string) => {
	switch (status) {
		case 'pending':
			return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
		case 'in_progress':
			return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
		case 'completed':
			return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
		case 'replied':
			return 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200';
		case 'rejected':
			return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
	}
};

// 카테고리 상태 텍스트 가져오기
export const getCategoryStatusText = (is_active: boolean): string => {
	return is_active ? '활성' : '비활성';
};

// 카테고리 상태에 따른 뱃지 variant 가져오기 (더 명확한 색상)
export const getCategoryStatusBadgeVariant = (is_active: boolean): 'default' | 'destructive' => {
	return is_active ? 'default' : 'destructive';
};

// 카테고리 상태에 따른 커스텀 스타일 가져오기
export const getCategoryStatusStyle = (is_active: boolean) => {
	return is_active
		? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
		: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
};

// 테스트 상태에 따른 커스텀 스타일 가져오기
export const getTestStatusStyle = (status: string) => {
	switch (status) {
		case 'published':
			return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
		case 'draft':
			return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
		case 'scheduled':
			return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
	}
};

// 프로필 상태에 따른 아이콘 가져오기
export const getStatusIcon = (status: string) => {
	switch (status) {
		case 'active':
			return '✅';
		case 'inactive':
			return '❌';
		case 'suspended':
			return '⚠️';
		default:
			return '🛡️';
	}
};

// 한국 시간대 기준 날짜 포맷팅 함수
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short',
		timeZone: 'Asia/Seoul',
		...options,
	});
};

// 한국 시간대 기준 가입 경과일 계산
export const getDaysSinceJoin = (createdAt: string | Date) => {
	const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

	// 현재 한국 시간
	const now = new Date();

	// 한국 시간대 기준으로 날짜만 비교
	const nowInKorea = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
	const createdInKorea = new Date(created.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

	// 날짜만 비교 (시간 제거)
	const nowDate = new Date(nowInKorea.getFullYear(), nowInKorea.getMonth(), nowInKorea.getDate());
	const createdDate = new Date(createdInKorea.getFullYear(), createdInKorea.getMonth(), createdInKorea.getDate());

	return Math.floor((nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
};

// 피드백 상태에 따른 우선순위 색상 가져오기
export const getPriorityColor = (status: string) => {
	switch (status) {
		case 'completed':
		case 'resolved':
			return 'from-green-50 to-emerald-50';
		case 'in_progress':
			return 'from-blue-50 to-cyan-50';
		case 'rejected':
			return 'from-red-50 to-pink-50';
		default:
			return 'from-yellow-50 to-orange-50';
	}
};

// ===== 대시보드 관련 유틸리티 함수들 =====

// 숫자 포맷팅 (천 단위 k 표시)
export const formatNumber = (num: number) => {
	if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
	return num.toLocaleString();
};

// 성장률 포맷팅
export const formatGrowth = (growth: number) => {
	const sign = growth > 0 ? '+' : '';
	return `${sign}${growth.toFixed(1)}%`;
};

// 성장률에 따른 색상 클래스
export const getGrowthColor = (growth: number) => {
	if (growth > 0) return 'text-green-600';
	if (growth < 0) return 'text-red-600';
	return 'text-gray-600';
};

// 알림 타입에 따른 아이콘
export const getAlertIcon = (type: string) => {
	switch (type) {
		case 'error':
			return '🚨';
		case 'warning':
			return '⚠️';
		case 'success':
			return '🎉';
		default:
			return 'ℹ️';
	}
};

// 알림 타입에 따른 색상 클래스
export const getAlertColor = (type: string) => {
	switch (type) {
		case 'error':
			return 'border-red-500 bg-red-50';
		case 'warning':
			return 'border-yellow-500 bg-yellow-50';
		case 'success':
			return 'border-green-500 bg-green-50';
		default:
			return 'border-blue-500 bg-blue-50';
	}
};

// 트렌드에 따른 아이콘 컴포넌트 반환
export const getTrendIcon = (trend: string) => {
	switch (trend) {
		case 'up':
			return 'TrendingUp';
		case 'down':
			return 'TrendingDown';
		default:
			return 'Activity';
	}
};

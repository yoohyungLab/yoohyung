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

// 통합된 상태 설정 객체 (프로필용)
export const getProfileStatusConfig = (status: string) => {
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
export const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' => {
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

// 카테고리 상태 텍스트 가져오기
export const getCategoryStatusText = (is_active: boolean): string => {
    return is_active ? '활성' : '비활성';
};

// 카테고리 상태에 따른 뱃지 variant 가져오기
export const getCategoryStatusBadgeVariant = (is_active: boolean): 'success' | 'secondary' => {
    return is_active ? 'success' : 'secondary';
};

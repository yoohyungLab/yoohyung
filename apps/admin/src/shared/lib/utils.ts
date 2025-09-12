import { PROFILE_PROVIDER_LABELS, PROFILE_STATUS, FEEDBACK_STATUS } from './constants';
import { formatDuration } from '@repo/shared';

// 간단한 cn 함수
export const cn = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
};

// 통합된 상태 설정 객체
export const getStatusConfig = (status: string) => {
    switch (status) {
        // 프로필 상태
        case PROFILE_STATUS.ACTIVE:
            return {
                text: '활성',
                color: 'bg-green-100 text-green-800',
            };
        case PROFILE_STATUS.INACTIVE:
            return {
                text: '비활성',
                color: 'bg-yellow-100 text-yellow-800',
            };
        case PROFILE_STATUS.DELETED:
            return {
                icon: '❌',
                text: '탈퇴',
                color: 'bg-red-100 text-red-800',
            };
        // 피드백 상태
        case FEEDBACK_STATUS.PENDING:
            return {
                text: '검토중',
                color: 'bg-yellow-100 text-yellow-800',
            };
        case FEEDBACK_STATUS.IN_PROGRESS:
            return {
                text: '진행중',
                color: 'bg-blue-100 text-blue-800',
            };
        case FEEDBACK_STATUS.COMPLETED:
            return {
                text: '완료',
                color: 'bg-green-100 text-green-800',
            };
        case FEEDBACK_STATUS.REPLIED:
            return {
                text: '답변완료',
                color: 'bg-purple-100 text-purple-800',
            };
        case FEEDBACK_STATUS.REJECTED:
            return {
                text: '반려',
                color: 'bg-red-100 text-red-800',
            };
        default:
            return {
                icon: '❓',
                text: '알수없음',
                color: 'bg-gray-100 text-gray-800',
            };
    }
};

// 하위 호환성을 위한 개별 함수들 (deprecated)
export const getStatusIcon = (status: string) => getStatusConfig(status).icon;
export const getStatusColor = (status: string) => getStatusConfig(status).color;
export const getStatusText = (status: string) => getStatusConfig(status).text;

export const getProviderText = (provider: string) => {
    return PROFILE_PROVIDER_LABELS[provider as keyof typeof PROFILE_PROVIDER_LABELS] || '이메일';
};

// formatDuration은 @repo/shared에서 import하여 사용

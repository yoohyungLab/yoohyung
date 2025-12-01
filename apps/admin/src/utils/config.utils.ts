import {
	USER_STATUSES,
	TEST_STATUSES,
	FEEDBACK_STATUSES,
	CATEGORY_STATUSES,
	TEST_TYPES,
	type UserStatus,
	type TestStatus,
	type FeedbackStatus,
	type CategoryStatus,
	type TestType,
} from '@/constants';

type BadgeVariant = 'success' | 'outline' | 'info' | 'destructive' | 'default' | 'warning' | 'secondary';

// Status Config 가져오기 (타입 안전성을 위한 헬퍼 - 직접 접근이 어려운 경우만)
export const getStatusConfig = (type: 'profile' | 'test' | 'feedback' | 'category', status: string | boolean) => {
	if (type === 'profile') {
		const statusKey = String(status) as UserStatus;
		return USER_STATUSES[statusKey] || { value: status, label: '알수없음', variant: 'default' as BadgeVariant };
	}

	if (type === 'test') {
		const statusKey = String(status) as TestStatus;
		return TEST_STATUSES[statusKey] || { value: status, label: '알수없음', variant: 'default' as BadgeVariant };
	}

	if (type === 'feedback') {
		const statusKey = String(status) as FeedbackStatus;
		return FEEDBACK_STATUSES[statusKey] || { value: status, label: '알수없음', variant: 'default' as BadgeVariant };
	}

	if (type === 'category') {
		const statusKey = status === true || status === 'active' ? 'active' : 'inactive';
		return (
			CATEGORY_STATUSES[statusKey as CategoryStatus] || {
				value: String(status),
				label: '알수없음',
				variant: 'default' as BadgeVariant,
			}
		);
	}

	return { value: String(status), label: '알수없음', variant: 'default' as BadgeVariant };
};

// Test Type Info 가져오기
export const getTestTypeInfo = (type: string) => {
	const typeKey = type as TestType;
	return TEST_TYPES[typeKey] || { value: type, name: '알 수 없음', description: '알 수 없는 테스트 유형' };
};

// Test Status Info 가져오기 (기존 호환성 유지)
export const getTestStatusInfo = (status: string) => {
	const config = getStatusConfig('test', status);
	return { name: config.label };
};

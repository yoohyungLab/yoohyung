'use client';

import { useAuthCallback } from '@/features/auth/hooks/useAuthCallback';
import { Loading } from '@/shared/components/loading';

export default function AuthCallbackPage() {
	const { error } = useAuthCallback();

	return <Loading message={error ? '인증 처리 중 오류가 발생했습니다.' : '인증 처리 중...'} fullScreen />;
}

'use client';

import { AuthLayout, AuthForm } from '@/features/auth';

export default function LoginPage() {
	return (
		<AuthLayout title="로그인" subtitle="픽키드에서 나를 발견해보세요">
			<AuthForm mode="login" />
		</AuthLayout>
	);
}

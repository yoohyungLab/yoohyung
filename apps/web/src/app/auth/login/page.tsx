'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { AuthLayout, AuthForm, type AuthFormData } from '@/shared/components/auth';

export default function LoginPage() {
	const router = useRouter();
	const { signIn } = useAuth();

	const handleLogin = async (data: AuthFormData) => {
		try {
			await signIn(data.email, data.password);
			router.push('/');
		} catch (error) {
			// 에러는 컴포넌트에서 처리 (toast, alert 등)
			console.error('Login error:', error);
		}
	};

	return (
		<AuthLayout title="로그인" subtitle="픽키드에서 나를 발견해보세요">
			<AuthForm mode="login" onSubmit={handleLogin} />
		</AuthLayout>
	);
}

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { AuthLayout, AuthForm, type AuthFormData } from '@/shared/components/auth';

export default function RegisterPage() {
	const router = useRouter();
	const { signUp } = useAuth();

	const handleRegister = async (data: AuthFormData) => {
		try {
			await signUp(data.email, data.password, data.name);
			router.push('/');
		} catch (error) {
			// 에러는 컴포넌트에서 처리 (toast, alert 등)
			console.error('Register error:', error);
		}
	};

	return (
		<AuthLayout title="회원가입" subtitle="픽키드와 함께 시작하세요" showLogo={true}>
			<AuthForm mode="register" onSubmit={handleRegister} />
		</AuthLayout>
	);
}

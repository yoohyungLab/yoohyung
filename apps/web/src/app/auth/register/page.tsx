import { Metadata } from 'next';
import { AuthLayout, AuthForm } from '@/app/auth/components';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
	title: '회원가입',
	description: '픽키드와 함께 시작하세요. 다양한 심리테스트를 통해 자신을 알아가보세요.',
	path: '/auth/register',
});

export default function RegisterPage() {
	return (
		<AuthLayout title="회원가입" subtitle="픽키드와 함께 시작하세요" showLogo={true}>
			<AuthForm mode="register" />
		</AuthLayout>
	);
}

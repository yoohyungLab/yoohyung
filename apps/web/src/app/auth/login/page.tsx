import { Metadata } from 'next';
import { AuthLayout, AuthForm } from '@/features/auth/ui';

// TODO: 메타데이터 왜 해놓은건지?
export const metadata: Metadata = {
	title: '로그인 | 픽키드',
	description: '픽키드에서 나를 발견해보세요. 다양한 심리 테스트를 통해 자신을 알아가보세요.',
	keywords: ['로그인', '픽키드', '심리테스트', '자기계발'],
	openGraph: {
		title: '로그인 | 픽키드',
		description: '픽키드에서 나를 발견해보세요. 다양한 심리 테스트를 통해 자신을 알아가보세요.',
		type: 'website',
	},
};

export default function LoginPage() {
	return (
		<AuthLayout title="로그인" subtitle="픽키드에서 나를 발견해보세요">
			<AuthForm mode="login" />
		</AuthLayout>
	);
}

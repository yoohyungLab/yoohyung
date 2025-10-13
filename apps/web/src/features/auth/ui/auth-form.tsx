'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DefaultInput, InputPassword, IconButton } from '@pickid/ui';
import { useAuthVM } from '../hooks';
import { mapAuthError } from '@/shared/lib/error-mapper';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '../schemas/auth.schema';

export interface AuthFormProps {
	mode: 'login' | 'register';
	children?: ReactNode;
}

// React Hook Form을 사용한 인증 폼 컴포넌트
export function AuthForm({ mode, children }: AuthFormProps) {
	const router = useRouter();
	const { signIn, signUp, signInWithKakao } = useAuthVM();

	const isLogin = mode === 'login';
	const isRegister = mode === 'register';

	// React Hook Form 설정
	const form = useForm({
		resolver: zodResolver(isLogin ? loginSchema : registerSchema),
		defaultValues: isLogin ? { email: '', password: '' } : { name: '', email: '', password: '', confirmPassword: '' },
		mode: 'onChange', // 실시간 유효성 검사
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = form;

	const onSubmit = async (data: LoginFormData | RegisterFormData) => {
		try {
			if (isLogin) {
				const loginData = data as LoginFormData;
				await signIn(loginData.email, loginData.password);
			} else {
				const registerData = data as RegisterFormData;
				await signUp(registerData.email, registerData.password, registerData.name);
			}
			router.push('/');
		} catch (err) {
			// 에러는 form.setError로 처리
			form.setError('root', {
				type: 'manual',
				message: mapAuthError(err),
			});
		}
	};

	const handleKakaoAuth = async () => {
		try {
			await signInWithKakao();
		} catch (err) {
			form.setError('root', {
				type: 'manual',
				message: mapAuthError(err),
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
			{/* 에러 메시지 */}
			{errors.root && (
				<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
					<div className="flex items-center">
						<span className="text-red-500 mr-2">⚠️</span>
						<p className="text-red-700 text-sm font-medium">{errors.root.message}</p>
					</div>
				</div>
			)}

			{/* 카카오 인증 버튼 */}
			<IconButton
				type="button"
				variant="kakao"
				className="mb-4 h-12 font-normal hover:scale-100"
				onClick={handleKakaoAuth}
				disabled={isSubmitting}
				icon={
					<Image src="/icons/kakao.svg" alt="카카오" width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
				}
				label="카카오로 3초 만에 시작하기"
			/>

			{/* 구분선 */}
			<div className="relative my-8">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-200" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-4 bg-white text-gray-400 font-medium">
						{isLogin ? '또는 이메일로 로그인' : '또는 이메일로 계속하기'}
					</span>
				</div>
			</div>

			{/* 회원가입 시 이름 필드 */}
			{isRegister && (
				<div className="space-y-2">
					<DefaultInput
						{...register('name')}
						id="name"
						type="text"
						placeholder="닉네임 또는 이름을 입력하세요"
						label="닉네임 또는 이름"
						className={`h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
							'name' in errors && errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
						}`}
					/>
					{'name' in errors && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
				</div>
			)}

			{/* 이메일 필드 */}
			<div className="space-y-2">
				<DefaultInput
					{...register('email')}
					id="email"
					type="email"
					placeholder="your@email.com"
					label="이메일"
					className={`h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
						errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
					}`}
				/>
				{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
			</div>

			{/* 비밀번호 필드 */}
			<div className="space-y-2">
				<InputPassword
					{...register('password')}
					id="password"
					placeholder={isLogin ? '••••••••' : '6자 이상의 비밀번호'}
					label="비밀번호"
					className={`h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
						errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
					}`}
				/>
				{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
			</div>

			{/* 회원가입 시 비밀번호 확인 필드 */}
			{isRegister && (
				<div className="space-y-2">
					<InputPassword
						{...register('confirmPassword')}
						id="confirmPassword"
						placeholder="비밀번호를 다시 입력하세요"
						label="비밀번호 확인"
						className={`h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
							'confirmPassword' in errors && errors.confirmPassword
								? 'border-red-500 focus:border-red-500 focus:ring-red-500'
								: ''
						}`}
					/>
					{'confirmPassword' in errors && errors.confirmPassword && (
						<p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
					)}
				</div>
			)}

			{/* 제출 버튼 */}
			<Button
				type="submit"
				className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mt-6"
				loading={isSubmitting}
				loadingText={isLogin ? '로그인 중...' : '회원가입 중...'}
			>
				{isLogin ? '로그인' : '회원가입'}
			</Button>

			{/* 추가 컨텐츠 (링크 등) */}
			{children}

			{/* 페이지 간 링크 */}
			<p className="text-center mt-8 pt-6 border-t border-gray-100 text-gray-600 text-sm">
				{isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
				<a
					href={isLogin ? '/auth/register' : '/auth/login'}
					className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
				>
					{isLogin ? '회원가입하기' : '로그인하기'}
				</a>
			</p>
		</form>
	);
}

'use client';

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import { Button, DefaultInput, InputPassword } from '@repo/ui';
import { useAuth } from '@/shared/hooks/useAuth';
import { mapAuthError } from '@/shared/lib/error-mapper';
import type { AuthFormData } from '@/shared/types/auth';

export interface AuthFormProps {
	mode: 'login' | 'register';
	onSubmit: (data: AuthFormData) => Promise<void>;
	children?: ReactNode;
}

// 공통 인증 폼 컴포넌트
export function AuthForm({ mode, onSubmit, children }: AuthFormProps) {
	const [formData, setFormData] = useState<AuthFormData>({
		email: '',
		password: '',
		name: '',
		confirmPassword: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { signInWithKakao } = useAuth();

	const isLogin = mode === 'login';
	const isRegister = mode === 'register';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// 회원가입 시 유효성 검사
		if (isRegister) {
			if (formData.password !== formData.confirmPassword) {
				setError('비밀번호가 일치하지 않습니다.');
				setLoading(false);
				return;
			}
			if (formData.password.length < 6) {
				setError('비밀번호는 6자 이상이어야 합니다.');
				setLoading(false);
				return;
			}
		}

		try {
			await onSubmit(formData);
		} catch (err) {
			setError(mapAuthError(err));
		} finally {
			setLoading(false);
		}
	};

	const handleKakaoAuth = async () => {
		try {
			await signInWithKakao();
		} catch (err) {
			setError(mapAuthError(err));
		}
	};

	const updateField = (field: keyof AuthFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* 에러 메시지 */}
			{error && (
				<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
					<div className="flex items-center">
						<span className="text-red-500 mr-2">⚠️</span>
						<p className="text-red-700 text-sm font-medium">{error}</p>
					</div>
				</div>
			)}

			{/* 카카오 인증 버튼 */}
			<Button
				type="button"
				className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-semibold mb-4 h-12 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
				onClick={handleKakaoAuth}
				disabled={loading}
			>
				<div className="flex items-center justify-center space-x-2">
					<Image src="/icons/kakao.svg" alt="카카오" width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
					<span>카카오로 3초 만에 시작하기</span>
				</div>
			</Button>

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
				<DefaultInput
					id="name"
					type="text"
					value={formData.name || ''}
					onChange={updateField('name')}
					required
					placeholder="닉네임 또는 이름을 입력하세요"
					label="닉네임 또는 이름"
					className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
				/>
			)}

			{/* 이메일 필드 */}
			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
					이메일
				</label>
				<DefaultInput
					id="email"
					type="email"
					value={formData.email}
					onChange={updateField('email')}
					required
					placeholder="your@email.com"
					className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
				/>
			</div>

			{/* 비밀번호 필드 */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
						비밀번호
					</label>
					{isLogin && (
						<button type="button" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
							비밀번호 찾기
						</button>
					)}
				</div>
				<InputPassword
					id="password"
					value={formData.password}
					onChange={updateField('password')}
					required
					minLength={6}
					placeholder={isLogin ? '••••••••' : '6자 이상의 비밀번호'}
					className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
				/>
			</div>

			{/* 회원가입 시 비밀번호 확인 필드 */}
			{isRegister && (
				<InputPassword
					id="confirmPassword"
					value={formData.confirmPassword || ''}
					onChange={updateField('confirmPassword')}
					required
					minLength={6}
					placeholder="비밀번호를 다시 입력하세요"
					label="비밀번호 확인"
					className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
				/>
			)}

			{/* 제출 버튼 */}
			<Button
				type="submit"
				className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mt-6"
				loading={loading}
				loadingText={isLogin ? '로그인 중...' : '회원가입 중...'}
			>
				{isLogin ? '로그인' : '회원가입'}
			</Button>

			{/* 추가 컨텐츠 (링크 등) */}
			{children}

			{/* 페이지 간 링크 */}
			<div className="text-center mt-8 pt-6 border-t border-gray-100">
				<p className="text-gray-600 text-sm">
					{isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
					<a
						href={isLogin ? '/auth/register' : '/auth/login'}
						className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
					>
						{isLogin ? '회원가입하기' : '로그인하기'}
					</a>
				</p>
			</div>
		</form>
	);
}

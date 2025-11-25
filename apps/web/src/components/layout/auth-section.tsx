'use client';

import { Button, IconButton } from '@pickid/ui';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/hooks/useAuth';

interface AuthSectionProps {
	onMenuClose: () => void;
}

export function AuthSection({ onMenuClose }: AuthSectionProps) {
	const router = useRouter();
	const { user, signOut, signInWithKakao } = useAuth();

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const handleSignIn = async (provider: string) => {
		if (provider === 'kakao') {
			try {
				await signInWithKakao();
			} catch (error) {
				console.error('Kakao login failed:', error);
				router.push('/auth/login');
			}
		} else {
			router.push('/auth/login');
		}
		onMenuClose();
	};

	const handleKakaoSignIn = () => {
		handleSignIn('kakao');
	};

	const handleLoginClick = () => {
		handleMenuClick('/auth/login');
	};

	const handleRegisterClick = () => {
		handleMenuClick('/auth/register');
	};

	const handleMenuClick = (href: string) => {
		onMenuClose();
		router.push(href);
	};

	if (user) {
		return (
			<div className="space-y-4">
				{/* 사용자 정보 섹션 */}
				<div className="bg-gray-50 rounded-lg p-4 mb-4">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
							{user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
								<Image
									src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}
									alt="프로필"
									width={40}
									height={40}
									className="rounded-full"
								/>
							) : (
								<User className="w-5 h-5 text-pink-600" />
							)}
						</div>
						<div>
							<p className="font-medium text-gray-900">
								{user.user_metadata?.name || user.email?.split('@')[0] || '사용자'}
							</p>
							<p className="text-sm text-gray-500">{user.email}</p>
						</div>
					</div>
				</div>

				{/* 로그아웃 버튼 */}
				<Button
					variant="outline"
					className="w-full text-red-600 border-red-200 hover:bg-red-50"
					onClick={handleSignOut}
				>
					<LogOut className="w-4 h-4 mr-2" />
					로그아웃
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<IconButton
				variant="kakao"
				className="w-full rounded-lg font-normal hover:scale-100"
				onClick={handleKakaoSignIn}
				icon={<Image src="/icons/kakao.svg" alt="카카오" width={16} height={16} />}
				label="카카오로 시작하기"
			/>
			<div className="text-center">
				<span className="text-sm text-gray-500">간편하게 3초만에 시작하세요</span>
			</div>
			<Button variant="outline" className="w-full" onClick={handleLoginClick}>
				로그인
			</Button>
			<Button variant="outline" className="w-full" onClick={handleRegisterClick}>
				회원가입
			</Button>
		</div>
	);
}

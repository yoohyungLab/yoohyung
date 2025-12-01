'use client';

import { Button } from '@pickid/ui';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/hooks/useAuth';
import { SITE_CONFIG } from '@/constants/site-config';
import { ROUTES } from '@/constants';
import { MenuContent } from './menu-content';

interface AuthSectionProps {
	onMenuClose: () => void;
}

export function AuthSection({ onMenuClose }: AuthSectionProps) {
	const router = useRouter();
	const { user, signOut } = useAuth();

	const handleSignOut = async () => {
		try {
			await signOut();
			onMenuClose();
			router.push(ROUTES.HOME);
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const handleMenuClick = (href: string) => {
		onMenuClose();
		router.push(href);
	};

	const handleAuthClick = () => {
		handleMenuClick(ROUTES.AUTH_LOGIN);
	};

	if (user) {
		return (
			<div className="flex flex-col h-full">
				{/* 상단 영역 - 사용자 프로필 */}
				<div className="bg-gray-50 border-b border-gray-200 py-8 px-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
							{user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
								<Image
									src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}
									alt="프로필"
									width={80}
									height={80}
									className="rounded-full"
								/>
							) : (
								<User className="w-10 h-10 text-pink-600" />
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm text-gray-500 truncate">{user.email}</p>
						</div>
					</div>
				</div>

				{/* 중간 영역 - 메뉴 */}
				<div className="flex-1 overflow-y-auto px-4">
					<MenuContent onMenuClick={onMenuClose} />
				</div>

				{/* 하단 영역 - 로그아웃 버튼 */}
				<div className="border-t border-gray-200 p-4">
					<Button
						variant="outline"
						className="w-full text-red-600 border-red-200 hover:bg-red-50"
						onClick={handleSignOut}
					>
						<LogOut className="w-4 h-4 mr-2" />
						로그아웃
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* 상단 영역 - 로고 + 사이트 정보 */}
			<div className="bg-gray-50 border-b border-gray-200 py-20 px-6">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex flex-col gap-1">
						<h2 className="text-xl font-bold text-gray-900">{SITE_CONFIG.name}</h2>
						<p className="text-sm text-gray-600">나를 알아가는 심리테스트</p>
					</div>
					<Button
						onClick={handleAuthClick}
						className="bg-white text-pink-600 border border-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full"
						text="로그인 / 회원가입하러가기"
					/>
				</div>
			</div>

			{/* 중간 영역 - 메뉴 */}
			<div className="flex-1 overflow-y-auto px-4">
				<MenuContent onMenuClick={onMenuClose} />
			</div>
		</div>
	);
}

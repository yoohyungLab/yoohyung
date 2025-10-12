'use client';

import { useAuthVM } from '@/features/auth/hooks';
import { useCategories } from '@/features/home';
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	IconButton,
} from '@pickid/ui';
import {
	Gamepad2,
	HeartHandshake,
	LogOut,
	Menu,
	MessageSquare,
	TestTube,
	TrendingUp,
	User,
	UserCheck,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Sidebar() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const router = useRouter();
	const { user, signOut, signInWithKakao } = useAuthVM();
	const { categories, loadCategories } = useCategories();

	// Drawer가 열릴 때 카테고리 로드
	const handleDrawerOpenChange = (open: boolean) => {
		setIsDrawerOpen(open);
		if (open) {
			loadCategories();
		}
	};

	// 요청된 순서대로 메뉴 생성
	const mainMenus = React.useMemo(() => {
		// 카테고리 이름 기반으로 특정 메뉴 매핑
		const getCategoryByKeyword = (keyword: string) => {
			return categories.find((category) => category.label.toLowerCase().includes(keyword.toLowerCase()));
		};
		// 카테고리가 로드되지 않았을 때 기본 메뉴 (하드코딩)
		if (categories.length === 0) {
			return [
				{
					icon: TestTube,
					label: '심리 테스트',
					href: '/category/psychology',
				},
				{
					icon: Gamepad2,
					label: '밸런스 게임',
					href: '/category/balance',
				},
				{
					icon: UserCheck,
					label: '성격 유형 테스트',
					href: '/category/personality',
				},
				{
					icon: HeartHandshake,
					label: '연애 유형 테스트',
					href: '/category/love',
				},
				{
					icon: TrendingUp,
					label: '요즘 인기 테스트',
					href: '/popular',
				},
			];
		}

		return [
			// 1. 심리테스트 - 카테고리 이름에 "심리"가 포함된 것
			(() => {
				const category = getCategoryByKeyword('심리');
				return category
					? {
							icon: TestTube,
							label: '심리 테스트',
							href: `/tests?category=${category.id}`,
					  }
					: null;
			})(),

			// 2. 밸런스게임 - 카테고리 이름에 "밸런스"가 포함된 것
			(() => {
				const category = getCategoryByKeyword('밸런스');
				return category
					? {
							icon: Gamepad2,
							label: '밸런스 게임',
							href: `/tests?category=${category.id}`,
					  }
					: null;
			})(),

			// 3. 성격/유형 - 카테고리 이름에 "성격" 또는 "유형"이 포함된 것
			(() => {
				const category = getCategoryByKeyword('성격') || getCategoryByKeyword('유형');
				return category
					? {
							icon: UserCheck,
							label: '성격 유형 테스트',
							href: `/tests?category=${category.id}`,
					  }
					: null;
			})(),

			// 4. 연애 - 카테고리 이름에 "연애"가 포함된 것
			(() => {
				const category = getCategoryByKeyword('연애');
				return category
					? {
							icon: HeartHandshake,
							label: '연애 유형 테스트',
							href: `/tests?category=${category.id}`,
					  }
					: null;
			})(),

			// 5. 인기 테스트 - 전체 테스트 중 인기 있는 것들
			{
				icon: TrendingUp,
				label: '요즘 인기 테스트',
				href: '/popular',
			},
		].filter((menu): menu is NonNullable<typeof menu> => menu !== null); // 타입 가드로 null 제거
	}, [categories]);

	// 실제 카테고리 메뉴만 사용
	const finalMainMenus = mainMenus;

	const etcMenus = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

	const handleMenuClick = (href: string) => {
		setIsDrawerOpen(false);
		router.push(href);
	};

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
				// Supabase Auth를 통한 카카오 로그인
				await signInWithKakao();
			} catch (error) {
				console.error('Kakao login failed:', error);
				// 에러 발생 시 로그인 페이지로 폴백
				router.push('/auth/login');
			}
		} else {
			router.push('/auth/login');
		}
		setIsDrawerOpen(false);
	};

	const MenuSection = ({
		title,
		menus,
	}: {
		title: string;
		menus: Array<{ icon: React.ComponentType<{ className?: string }>; label: string; href: string }>;
	}) => (
		<div className="my-6">
			<h3 className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-2">{title}</h3>
			<div className="space-y-2">
				{menus.map((menu, index) => (
					<button
						key={index}
						onClick={() => handleMenuClick(menu.href)}
						className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
					>
						<menu.icon className="w-4 h-4 mr-3" />
						{menu.label}
					</button>
				))}
			</div>
		</div>
	);

	return (
		<div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/icons/logo.svg" alt="로고" width={50} height={50} />
				</Link>

				<Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
					<DrawerTrigger asChild>
						<Button variant="outline" size="sm" className="p-2">
							<Menu className="w-4 h-4" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="max-w-mobile mx-auto">
						<DrawerHeader className="text-left">
							<DrawerTitle className="flex items-center justify-between">
								<span>메뉴</span>
								<DrawerClose asChild>
									<Button variant="ghost" size="sm" className="p-2">
										<X className="w-4 h-4" />
									</Button>
								</DrawerClose>
							</DrawerTitle>
						</DrawerHeader>
						<div className="px-6 py-6">
							{user ? (
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
							) : (
								<div className="space-y-3">
									<IconButton
										variant="kakao"
										className="w-full rounded-lg font-normal hover:scale-100"
										onClick={() => handleSignIn('kakao')}
										icon={<Image src="/icons/kakao.svg" alt="카카오" width={16} height={16} />}
										label="카카오로 시작하기"
									/>
									<div className="text-center">
										<span className="text-sm text-gray-500">간편하게 3초만에 시작하세요</span>
									</div>
									<Button variant="outline" className="w-full" onClick={() => handleMenuClick('/auth/login')}>
										로그인
									</Button>
									<Button variant="outline" className="w-full" onClick={() => handleMenuClick('/auth/register')}>
										회원가입
									</Button>
								</div>
							)}

							{/* 메뉴 섹션들 */}
							<MenuSection title="주요 메뉴" menus={finalMainMenus} />
							<MenuSection title="기타 기능" menus={etcMenus} />
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
}

export default Sidebar;

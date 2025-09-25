'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@repo/ui';
import { useAuth } from '@/shared/lib/auth';
import { supabase } from '@repo/shared';
import {
	Menu,
	X,
	User,
	LogOut,
	LogIn,
	UserPlus,
	Clock,
	Pencil,
	MessageSquare,
	Brain,
	Briefcase,
	Palette,
	Heart,
	Flame,
	Trash2,
	AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function Sidebar() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { user, signIn, signOut } = useAuth();

	const router = useRouter();

	const mainMenus = [
		{ icon: Brain, label: '심리 테스트', href: '/tests/psychology' },
		{ icon: Briefcase, label: '직업 성향 테스트', href: '/tests/career' },
		{ icon: Palette, label: '성격 유형 테스트', href: '/tests/personality' },
		{ icon: Heart, label: '연애 관련 테스트', href: '/tests/love' },
		{ icon: Flame, label: '요즘 인기 테스트', href: '/tests/trending' },
	];

	const userMenus = [
		{ icon: Heart, label: '찜한 테스트', href: '/favorites' },
		{ icon: Clock, label: '테스트 히스토리', href: '/test-history' },
		{ icon: Pencil, label: '내가 만든 테스트', href: '/my-tests' },
	];

	const etcMenus = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

	const handleMenuClick = (href: string) => {
		setIsDrawerOpen(false);
		router.push(href);
	};

	const handleKakaoLogin = async () => {
		try {
			await signIn('kakao');
		} catch (error) {
			console.error('Kakao login failed:', error);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const handleDeleteAccount = async () => {
		if (!user) return;

		try {
			setIsDeleting(true);

			// 1. 사용자 메타데이터에 삭제 시간 설정
			const deletedAt = new Date().toISOString();
			await supabase.auth.updateUser({
				data: {
					deleted_at: deletedAt,
					name: `삭제된사용자_${Date.now()}`, // 이름 익명화
				},
			});

			// 2. 프로필에 삭제 시간 표시 (소프트 삭제)
			const { error: profileError } = await supabase
				.from('profiles')
				.update({
					deleted_at: deletedAt,
					name: `삭제된사용자_${Date.now()}`, // 이름 익명화
					email: null, // 이메일 제거
				})
				.eq('id', user.id);

			if (profileError) {
				console.error('프로필 삭제 실패:', profileError);
				// 프로필 업데이트 실패해도 메타데이터는 업데이트되었으므로 계속 진행
			}

			// 3. 관련 데이터도 소프트 삭제 또는 사용자 연결 해제
			// 테스트 결과는 통계를 위해 남겨두되, user_id만 null로 변경
			await supabase.from('test_results').update({ user_id: null }).eq('user_id', user.id);

			// 찜 목록은 완전 삭제
			await supabase.from('favorites').delete().eq('user_id', user.id);

			// 사용자 응답이 있다면 user_id null로 변경
			await supabase.from('user_responses').update({ user_id: null }).eq('user_id', user.id);

			// 4. 로그아웃 처리
			await signOut();

			// 5. 메인 페이지로 이동
			router.push('/');

			alert('회원탈퇴가 완료되었습니다.');
		} catch (error) {
			console.error('회원탈퇴 실패:', error);
			alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
			setIsDrawerOpen(false);
		}
	};

	// 회원탈퇴 확인 모달 열기 (사이드바 자동 닫기)
	const handleShowDeleteConfirm = () => {
		setIsDrawerOpen(false); // 사이드바 먼저 닫기
		setTimeout(() => {
			setShowDeleteConfirm(true); // 약간의 딜레이 후 모달 열기
		}, 150); // 사이드바 닫힘 애니메이션 후 모달 표시
	};

	// 회원탈퇴 모달 닫기
	const handleCloseDeleteConfirm = () => {
		setShowDeleteConfirm(false);
	};

	const renderMenuGroup = (
		title: string,
		menus: Array<{
			icon: React.ComponentType<{ className?: string }>;
			label: string;
			href: string;
		}>
	) => (
		<div className="my-6">
			<h3 className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-2" />
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
		<div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
			<div className="flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/icons/logo.svg" alt="로고" width={32} height={32} />
					<span className="text-xl font-bold text-gray-900">유형연구소</span>
				</Link>

				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
									<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
										<div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="font-medium text-gray-900">{user.name}</div>
											<div className="text-sm text-gray-500">{user.email}</div>
										</div>
									</div>
									<div className="space-y-2">
										<Button variant="outline" className="w-full" onClick={handleLogout}>
											<LogOut className="w-4 h-4 mr-2" /> 로그아웃
										</Button>
										<Button
											variant="outline"
											className="w-full text-red-600 border-red-200 hover:bg-red-50"
											onClick={handleShowDeleteConfirm}
										>
											<Trash2 className="w-4 h-4 mr-2" /> 회원탈퇴
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-3">
									<Button
										className="w-full bg-[#FEE500] hover:bg-[#FEE500] text-black font-medium"
										onClick={handleKakaoLogin}
									>
										<div className="flex items-center space-x-2">
											<Image src="/icons/kakao.svg" alt="카카오" width={16} height={16} />
											<span>카카오로 시작하기</span>
										</div>
									</Button>
									<div className="text-center">
										<span className="text-sm text-gray-500">간편하게 3초만에 시작하세요</span>
									</div>
									<Button variant="outline" className="w-full" onClick={() => handleMenuClick('/auth/login')}>
										<LogIn className="w-4 h-4 mr-2" /> 로그인
									</Button>
									<Button variant="ghost" className="w-full" onClick={() => handleMenuClick('/auth/register')}>
										<UserPlus className="w-4 h-4 mr-2" /> 회원가입
									</Button>
								</div>
							)}

							{renderMenuGroup('주요 메뉴', mainMenus)}
							{user && renderMenuGroup('사용자 기능', userMenus)}
							{renderMenuGroup('기타 기능', etcMenus)}
						</div>
					</DrawerContent>
				</Drawer>
			</div>

			{/* 회원탈퇴 확인 다이얼로그 */}
			{showDeleteConfirm && (
				<div
					className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
					onClick={handleCloseDeleteConfirm}
				>
					<div
						className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-200 scale-100"
						onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
					>
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-6 h-6 text-red-600" />
							</div>
							<div>
								<h3 className="font-bold text-lg text-gray-900">회원탈퇴</h3>
								<p className="text-sm text-gray-600">정말로 탈퇴하시겠습니까?</p>
							</div>
						</div>

						<div className="mb-6">
							<p className="text-sm text-gray-600 mb-3 font-medium">탈퇴하면 다음 데이터가 영구 삭제됩니다:</p>
							<div className="bg-red-50 rounded-lg p-3 border border-red-100">
								<ul className="text-sm text-red-700 space-y-1">
									<li className="flex items-center">
										<span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
										계정 정보 및 프로필
									</li>
									<li className="flex items-center">
										<span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
										모든 테스트 결과
									</li>
									<li className="flex items-center">
										<span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
										찜한 테스트 목록
									</li>
									<li className="flex items-center">
										<span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
										테스트 히스토리
									</li>
								</ul>
							</div>
						</div>

						<div className="flex space-x-3">
							<Button
								variant="outline"
								className="flex-1 font-medium"
								onClick={handleCloseDeleteConfirm}
								disabled={isDeleting}
							>
								취소
							</Button>
							<Button
								className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
								onClick={handleDeleteAccount}
								disabled={isDeleting}
							>
								{isDeleting ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>처리중...</span>
									</div>
								) : (
									'탈퇴하기'
								)}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Sidebar;

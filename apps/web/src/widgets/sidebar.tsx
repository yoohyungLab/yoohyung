'use client';

import { useState } from 'react';
import {
    AlertTriangle,
    Brain,
    Briefcase,
    Heart,
    Flame,
    LogIn,
    LogOut,
    Menu,
    MessageSquare,
    Palette,
    Settings,
    Star,
    User,
    UserPlus,
    X,
    Clock,
    Pencil,
    Trash2,
} from 'lucide-react';
import { Button } from '@/ui/components/button';
import Link from 'next/link';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/ui/components/drawer';
export default function ImprovedSidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [user, setUser] = useState({
        name: '김테스트',
        email: 'test@example.com',
        completedTests: 12,
        favoriteTests: 5,
    });

    const mainMenus = [
        { icon: Brain, label: '심리 테스트', href: '/tests/psychology' },
        { icon: Briefcase, label: '직업 성향 테스트', href: '/tests/career' },
        { icon: Palette, label: '성격 유형 테스트', href: '/tests/personality' },
        { icon: Heart, label: '연애 관련 테스트', href: '/tests/love' },
        { icon: Flame, label: '요즘 인기 테스트', href: '/tests/trending' },
    ];

    const userMenus = [
        { icon: Star, label: '찜한 테스트', href: '/favorites' },
        { icon: Clock, label: '테스트 히스토리', href: '/test-history' },
        { icon: Pencil, label: '내가 만든 테스트', href: '/my-tests' },
    ];

    const etcMenus = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

    const handleMenuClick = (href) => {
        setIsDrawerOpen(false);
        console.log('Navigate to:', href);
    };

    const handleKakaoLogin = () => {
        console.log('Kakao login');
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setTimeout(() => {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setIsDrawerOpen(false);
            setUser(null);
        }, 2000);
    };

    const renderMenuGroup = (title: string, menus: any[]) => (
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

    const renderUserProfile = () => (
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
                <button
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
                    onClick={() => handleMenuClick('/settings')}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    설정
                </button>
                <button
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                </button>
            </div>
        </div>
    );

    const renderGuestLogin = () => (
        <div className="space-y-3">
            <button
                className="w-full px-4 py-3 bg-[#FEE500] hover:bg-[#FEE500] text-black font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                onClick={handleKakaoLogin}
            >
                <div className="flex items-center space-x-2">
                    <img src="/icons/kakao.svg" alt="카카오" className="w-4 h-4" />
                    <span>카카오로 시작하기</span>
                </div>
            </button>
            <div className="text-center">
                <span className="text-sm text-gray-500">간편하게 3초만에 시작하세요</span>
            </div>
            <button
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
                onClick={() => handleMenuClick('/auth/login')}
            >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
            </button>
            <button
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
                onClick={() => handleMenuClick('/auth/register')}
            >
                <UserPlus className="w-4 h-4 mr-2" />
                회원가입
            </button>
        </div>
    );

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/icons/logo.svg" alt="로고" className="w-8 h-8" />
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
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                        <X className="w-4 h-4" />
                                    </button>
                                </DrawerClose>
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="px-6 py-6">
                            {user ? renderUserProfile() : renderGuestLogin()}

                            {renderMenuGroup('주요 메뉴', mainMenus)}
                            {user && renderMenuGroup('사용자 기능', userMenus)}
                            {renderMenuGroup('기타 기능', etcMenus)}

                            {/* 회원탈퇴 (로그인 시에만, 하단에 작게) */}
                            {user && (
                                <div className="pt-4">
                                    <button
                                        onClick={() => {
                                            setIsDrawerOpen(false);
                                            setTimeout(() => setShowDeleteConfirm(true), 150);
                                        }}
                                        className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 py-2"
                                    >
                                        회원탈퇴
                                    </button>
                                </div>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* 회원탈퇴 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
                    <div
                        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-200 scale-100"
                        onClick={(e) => e.stopPropagation()}
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
                            <button
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                취소
                            </button>
                            <button
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>처리중...</span>
                                    </div>
                                ) : (
                                    '탈퇴하기'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

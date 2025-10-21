'use client';

import { Gamepad2, HeartHandshake, MessageSquare, TestTube, TrendingUp, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MenuSectionProps {
	title: string;
	menus: Array<{ icon: React.ComponentType<{ className?: string }>; label: string; href: string }>;
	onMenuClick: (href: string) => void;
}

function MenuSection({ title, menus, onMenuClick }: MenuSectionProps) {
	return (
		<div className="my-6">
			<h3 className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-2">{title}</h3>
			<div className="space-y-2">
				{menus.map((menu, index) => (
					<button
						key={index}
						onClick={() => onMenuClick(menu.href)}
						className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
					>
						<menu.icon className="w-4 h-4 mr-3" />
						{menu.label}
					</button>
				))}
			</div>
		</div>
	);
}

interface MenuContentProps {
	onMenuClick: (href: string) => void;
}

export function MenuContent({ onMenuClick }: MenuContentProps) {
	const router = useRouter();

	// 하드코딩된 메뉴 (카테고리 API 의존성 제거)
	const mainMenus = [
		{
			icon: TestTube,
			label: '심리 테스트',
			href: '/category?category=psychology',
		},
		{
			icon: Gamepad2,
			label: '밸런스 게임',
			href: '/category?category=balance',
		},
		{
			icon: UserCheck,
			label: '성격 유형 테스트',
			href: '/category?category=personality',
		},
		{
			icon: HeartHandshake,
			label: '연애 유형 테스트',
			href: '/category?category=love',
		},
		{
			icon: TrendingUp,
			label: '요즘 인기 테스트',
			href: '/popular',
		},
	];

	const handleMenuClick = (href: string) => {
		onMenuClick(href);
		router.push(href);
	};

	const etcMenus = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

	return (
		<>
			<MenuSection title="주요 메뉴" menus={mainMenus} onMenuClick={handleMenuClick} />
			<MenuSection title="기타 기능" menus={etcMenus} onMenuClick={handleMenuClick} />
		</>
	);
}

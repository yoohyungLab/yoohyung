'use client';

import { Gamepad2, HeartHandshake, MessageSquare, TestTube, TrendingUp, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuContentProps {
	onMenuClick: () => void;
}

const MAIN_MENUS = [
	{ icon: TestTube, label: '심리 테스트', href: '/category?category=psychology' },
	{ icon: Gamepad2, label: '밸런스 게임', href: '/category?category=balance' },
	{ icon: UserCheck, label: '성격 유형 테스트', href: '/category?category=personality' },
	{ icon: HeartHandshake, label: '연애 유형 테스트', href: '/category?category=love' },
	{ icon: TrendingUp, label: '요즘 인기 테스트', href: '/popular' },
];

const ETC_MENUS = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

export function MenuContent({ onMenuClick }: MenuContentProps) {
	const router = useRouter();

	const handleClick = (href: string) => {
		router.push(href);
		onMenuClick();
	};

	return (
		<>
			<div className="my-6">
				<h3 className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-2">주요 메뉴</h3>
				<div className="space-y-2">
					{MAIN_MENUS.map((menu) => (
						<button
							key={menu.href}
							onClick={() => handleClick(menu.href)}
							className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
						>
							<menu.icon className="w-4 h-4 mr-3" />
							{menu.label}
						</button>
					))}
				</div>
			</div>

			<div className="my-6">
				<h3 className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-2">기타 기능</h3>
				<div className="space-y-2">
					{ETC_MENUS.map((menu) => (
						<button
							key={menu.href}
							onClick={() => handleClick(menu.href)}
							className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
						>
							<menu.icon className="w-4 h-4 mr-3" />
							{menu.label}
						</button>
					))}
				</div>
			</div>
		</>
	);
}

import { Gamepad2, HeartHandshake, MessageSquare, TestTube, TrendingUp, UserCheck } from 'lucide-react';

export const MAIN_MENUS = [
	{ icon: TestTube, label: '심리 테스트', href: '/category?category=psychology' },
	{ icon: Gamepad2, label: '밸런스 게임', href: '/category?category=balance' },
	{ icon: UserCheck, label: '성격 유형 테스트', href: '/category?category=personality' },
	{ icon: HeartHandshake, label: '연애 유형 테스트', href: '/category?category=love' },
	{ icon: TrendingUp, label: '요즘 인기 테스트', href: '/popular' },
];

export const ETC_MENUS = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

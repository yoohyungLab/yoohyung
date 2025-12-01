import { Gamepad2, HeartHandshake, MessageSquare, TestTube, TrendingUp, UserCheck } from 'lucide-react';
import { ROUTES } from './routes';

export const MAIN_MENUS = [
	{ icon: TestTube, label: '심리 테스트', href: `${ROUTES.TESTS_CATEGORY}?category=psychology` },
	{ icon: Gamepad2, label: '밸런스 게임', href: `${ROUTES.TESTS_CATEGORY}?category=balance` },
	{ icon: UserCheck, label: '성격 유형 테스트', href: `${ROUTES.TESTS_CATEGORY}?category=personality` },
	{ icon: HeartHandshake, label: '연애 유형 테스트', href: `${ROUTES.TESTS_CATEGORY}?category=love` },
	{ icon: TrendingUp, label: '요즘 인기 테스트', href: ROUTES.TEST_POPULAR },
];

export const ETC_MENUS = [{ icon: MessageSquare, label: '건의사항 작성하기', href: ROUTES.FEEDBACK }];

export const HOME_BANNERS = [
	{ id: '73c68247-907f-49c7-a5c5-e74f4b990232', image: '/images/banner-5.svg' },
	{ id: 'e0b80003-0c7c-4daf-a792-076dd0a284ee', image: '/images/banner-4.svg' },
	{ id: 'eec5eb18-3629-4e44-b18a-88fc3b8f2446', image: '/images/banner-2.png' },
	{ id: '1f3bf2c8-4f8d-4df2-80f8-5f551654a025', image: '/images/banner-1.svg' },
	{ id: '73c68247-907f-49c7-a5c5-e74f4b990232', image: '/images/banner-3.svg' },
];

export const PAGINATION = {
	pageSize: 20,
	defaultPage: 1,
} as const;

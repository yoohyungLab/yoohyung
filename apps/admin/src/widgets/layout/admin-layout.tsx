import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Plus } from 'lucide-react';

type NavEntry =
	| {
			type: 'section';
			name: string;
	  }
	| {
			type: 'item';
			name: string;
			href: string;
			icon: string;
			description?: string;
			badge?: string;
			// 활성 매칭 우선순위 향상을 위한 prefix(여러 개 가능)
			match?: string[];
	  };

const navigation: NavEntry[] = [
	{
		type: 'item',
		name: '대시보드',
		href: '/',
		icon: '📊',
		description: '전체 현황 및 통계',
		match: ['/'],
	},

	{ type: 'section', name: '콘텐츠 운영' },
	{
		type: 'item',
		name: '테스트 관리',
		href: '/tests',
		icon: '📝',
		description: '테스트 목록 및 관리',
		match: ['/tests', '/tests/create'],
	},
	{
		type: 'item',
		name: '테스트 생성',
		href: '/tests/create',
		icon: '➕',
		description: '새로운 테스트 만들기',
		match: ['/tests/create'],
	},
	{
		type: 'item',
		name: '카테고리 관리',
		href: '/categories',
		icon: '🏷️',
		description: '테스트 카테고리 관리',
		match: ['/categories'],
	},

	{ type: 'section', name: '데이터 & 분석' },
	{
		type: 'item',
		name: '사용자 응답',
		href: '/responses',
		icon: '👥',
		description: '사용자 응답 관리',
		match: ['/responses'],
	},
	{
		type: 'item',
		name: '결과 분석',
		href: '/results',
		icon: '📈',
		description: '테스트 결과 분석',
		match: ['/results'],
	},

	// ✅ 신규: 마케팅 분석 (유입·퍼널·가입 중심, 결과 분석과 별개)
	{
		type: 'item',
		name: '마케팅 분석',
		href: '/growth',
		icon: '📣',
		description: '유입·퍼널·가입 분석',
		match: ['/growth', '/growth/funnel', '/growth/channels', '/growth/landings', '/growth/cohorts'], // 필요시 라우트에 맞춰 조정
	},

	{ type: 'section', name: '유저 & 커뮤니티' },
	{
		type: 'item',
		name: '유저 관리',
		href: '/users',
		icon: '🧑‍💼',
		description: '유저 정보 한눈에',
		match: ['/users'],
	},
	{
		type: 'item',
		name: '건의사항 관리',
		href: '/feedbacks',
		icon: '💬',
		description: '건의사항 관리',
		match: ['/feedbacks'],
	},
];

// 헬퍼 함수를 컴포넌트 외부로 이동
function isActivePath(pathname: string, entry: NavEntry) {
	if (entry.type !== 'item') return false;
	if (entry.href === '/') return pathname === '/';
	const prefixes = entry.match ?? [entry.href];
	return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function AdminLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { adminUser, loading, logout } = useAdminAuth();

	// 모든 useState를 맨 위에 배치
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem('admin.sidebarCollapsed');
		return saved ? saved === '1' : window.matchMedia('(max-width: 1024px)').matches;
	});
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	// 모든 useEffect를 useState 다음에 배치
	useEffect(() => {
		localStorage.setItem('admin.sidebarCollapsed', sidebarCollapsed ? '1' : '0');
	}, [sidebarCollapsed]);

	// 인증 체크 로직
	useEffect(() => {
		if (!loading && !adminUser) {
			console.log('인증되지 않은 사용자, /auth로 리다이렉트');
			navigate('/auth');
		}
	}, [adminUser, loading, navigate]);

	// 모든 useMemo를 useEffect 다음에 배치
	const currentMeta = useMemo(() => {
		const current = navigation.find((n) => n.type === 'item' && isActivePath(location.pathname, n)) as
			| Extract<NavEntry, { type: 'item' }>
			| undefined;

		return current ?? (navigation[0] as Extract<NavEntry, { type: 'item' }>);
	}, [location.pathname]);

	const showCreateTestCTA = useMemo(() => {
		return location.pathname === '/tests' || location.pathname.startsWith('/tests/');
	}, [location.pathname]);

	// 로딩 중일 때
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span className="ml-2">로딩 중...</span>
			</div>
		);
	}

	// 인증되지 않은 사용자일 때
	if (!adminUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">인증 확인 중...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-layout flex h-screen bg-gray-50 text-gray-900">
			{/* 사이드바 */}
			<aside
				className={`admin-sidebar bg-gray-900 text-white transition-all duration-300 ease-in-out ${
					sidebarCollapsed ? 'w-16' : 'w-64'
				}`}
				aria-label="사이드바 내비게이션"
				aria-expanded={!sidebarCollapsed}
			>
				<div className="flex flex-col h-full">
					{/* 로고/토글 */}
					<div className="flex items-center justify-between h-16 px-3 border-b border-gray-800">
						{!sidebarCollapsed && <h1 className="font-bold text-lg tracking-tight">TypologyLab</h1>}
						<button
							onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
							className="text-gray-300 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
							aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
							title={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
						>
							{sidebarCollapsed ? '→' : '←'}
						</button>
					</div>

					{/* 네비게이션 */}
					<nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
						{navigation.map((entry, idx) => {
							if (entry.type === 'section') {
								return (
									<div
										key={`sec-${entry.name}-${idx}`}
										className={`pt-4 ${idx !== 0 ? 'mt-2 border-t border-gray-800' : ''}`}
									>
										{!sidebarCollapsed && (
											<div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-gray-400">{entry.name}</div>
										)}
									</div>
								);
							}

							const active = isActivePath(location.pathname, entry);
							return (
								<Link
									key={entry.name}
									to={entry.href}
									className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 outline-none ${
										active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
									}`}
									aria-current={active ? 'page' : undefined}
									title={sidebarCollapsed ? entry.name : undefined}
								>
									<span className="mr-3 text-lg" aria-hidden>
										{entry.icon}
									</span>
									{!sidebarCollapsed && (
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between gap-2">
												<span className="truncate">{entry.name}</span>
												{entry.badge && (
													<span className="shrink-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
														{entry.badge}
													</span>
												)}
											</div>
											{entry.description && (
												<p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{entry.description}</p>
											)}
										</div>
									)}
								</Link>
							);
						})}
					</nav>
				</div>
			</aside>

			{/* 메인 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* 헤더 */}
				<header className="admin-header h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200">
					<div className="flex items-center gap-3 min-w-0">
						<h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{currentMeta.name}</h2>
						{currentMeta.description && (
							<span className="hidden md:inline text-sm text-gray-500 truncate">{currentMeta.description}</span>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* 상단 CTA */}
						{showCreateTestCTA && (
							<button
								onClick={() => navigate('/tests/create')}
								className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								title="테스트 만들기"
							>
								<Plus className="w-4 h-4 text-white" />
								테스트 만들기
							</button>
						)}

						{/* 사용자 메뉴 */}
						<div className="relative">
							<button
								onClick={() => setUserMenuOpen((v) => !v)}
								className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
								aria-haspopup="menu"
								aria-expanded={userMenuOpen}
								aria-label="사용자 메뉴 열기"
							>
								<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
									{adminUser?.email?.charAt(0).toUpperCase() || 'A'}
								</div>
								<div className="hidden sm:block text-left">
									<p className="text-sm font-medium text-gray-800">관리자</p>
									<p className="text-xs text-gray-500">{adminUser?.email}</p>
								</div>
								<span className="text-gray-400" aria-hidden>
									▼
								</span>
							</button>

							{userMenuOpen && (
								<div
									role="menu"
									className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
								>
									<button
										onClick={logout}
										className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
									>
										로그아웃
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* 콘텐츠 */}
				<main className="animate-[fadeIn_200ms_ease-out] admin-content flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

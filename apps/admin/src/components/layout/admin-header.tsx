import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { navigation, isActivePath, type NavEntry } from '@/shared/config/navigation';

interface AdminHeaderProps {
	adminUser: { email?: string | null } | null;
	onLogout: () => void;
}

export function AdminHeader({ adminUser, onLogout }: AdminHeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	// 현재 페이지 메타데이터 계산
	const currentMeta = navigation.find((n) => n.type === 'item' && isActivePath(location.pathname, n)) as
		| Extract<NavEntry, { type: 'item' }>
		| undefined;

	const meta = currentMeta ?? (navigation[0] as Extract<NavEntry, { type: 'item' }>);

	// 테스트 생성 CTA 표시 여부
	const showCreateTestCTA = location.pathname === '/tests' || location.pathname.startsWith('/tests/');

	return (
		<header className="admin-header h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200">
			<div className="flex items-center gap-3 min-w-0">
				<h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{meta.name}</h2>
				{meta.description && (
					<span className="hidden md:inline text-sm text-gray-500 truncate">{meta.description}</span>
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
								onClick={onLogout}
								className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
							>
								로그아웃
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { navigation, isActivePath, type NavEntry } from '@/config/navigation';
import { PATH } from '@/constants/routes';
import type { User } from '@pickid/supabase';

interface IAdminHeaderProps {
	user: User | null;
	onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: IAdminHeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// 현재 페이지 메타데이터
	const currentMeta = navigation.find((n) => n.type === 'item' && isActivePath(location.pathname, n)) as
		| Extract<NavEntry, { type: 'item' }>
		| undefined;

	const meta = currentMeta ?? (navigation[0] as Extract<NavEntry, { type: 'item' }>);

	// 테스트 생성 CTA 표시 여부
	const showCreateTestCTA = location.pathname === '/tests' || location.pathname.startsWith('/tests/');

	// 외부 클릭 감지 (메뉴 닫기)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		};

		if (userMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [userMenuOpen]);

	const handleCreateTest = () => {
		navigate(PATH.TEST_CREATE);
	};

	const handleToggleMenu = () => {
		setUserMenuOpen((prev) => !prev);
	};

	const handleLogout = () => {
		setUserMenuOpen(false);
		onLogout();
	};

	return (
		<header className="admin-header h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200">
			{/* 페이지 제목 */}
			<div className="flex items-center gap-3 min-w-0">
				<h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{meta.name}</h2>
				{meta.description && (
					<span className="hidden md:inline text-sm text-gray-500 truncate">{meta.description}</span>
				)}
			</div>

			{/* 액션 버튼 & 사용자 메뉴 */}
			<div className="flex items-center gap-2">
				{/* 테스트 생성 버튼 */}
				{showCreateTestCTA && (
					<button
						onClick={handleCreateTest}
						className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						title="테스트 만들기"
					>
						<Plus className="w-4 h-4" />
						<span>테스트 만들기</span>
					</button>
				)}

				{/* 사용자 메뉴 */}
				<div className="relative" ref={menuRef}>
					<button
						onClick={handleToggleMenu}
						className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
						aria-haspopup="menu"
						aria-expanded={userMenuOpen}
						aria-label="사용자 메뉴"
					>
						<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
							{user?.email?.charAt(0).toUpperCase() || 'A'}
						</div>
						<div className="hidden sm:block text-left">
							<p className="text-sm font-medium text-gray-800">관리자</p>
							<p className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</p>
						</div>
						<span className="text-gray-400 text-xs" aria-hidden="true">
							▼
						</span>
					</button>

					{/* 드롭다운 메뉴 */}
					{userMenuOpen && (
						<div
							role="menu"
							className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
						>
							<button
								onClick={handleLogout}
								role="menuitem"
								className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
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

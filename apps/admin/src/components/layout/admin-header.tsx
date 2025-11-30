import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { navigation, isActivePath, type NavEntry } from '@/config/navigation';
import { PATH } from '@/constants/routes';
import type { AdminUser } from '@pickid/supabase';

interface IAdminHeaderProps {
	user: AdminUser | null;
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
		<header className="bg-white border-b border-neutral-200 px-6 py-4">
			<div className="flex items-center justify-between">
				{/* 페이지 제목 */}
				<div className="flex items-center gap-3 min-w-0">
					<h1 className="text-2xl text-neutral-900 font-semibold">{meta.name}</h1>
					{meta.description && (
						<span className="hidden md:inline text-sm text-neutral-500 truncate">{meta.description}</span>
					)}
				</div>

				{/* 액션 버튼 & 사용자 메뉴 */}
				<div className="flex items-center gap-4">
					{/* 테스트 생성 버튼 */}
					{showCreateTestCTA && (
						<button
							onClick={handleCreateTest}
							className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white text-sm rounded-lg hover:bg-neutral-700 transition-colors"
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
							className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
							aria-haspopup="menu"
							aria-expanded={userMenuOpen}
							aria-label="사용자 메뉴"
						>
							<div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
								{user?.email?.charAt(0).toUpperCase() || 'A'}
							</div>
							<div className="hidden sm:block text-left">
								<p className="text-sm font-medium text-neutral-900">관리자</p>
								<p className="text-xs text-neutral-500 truncate max-w-[120px]">{user?.email}</p>
							</div>
						</button>

						{/* 드롭다운 메뉴 */}
						{userMenuOpen && (
							<div
								role="menu"
								className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-neutral-200"
							>
								<button
									onClick={handleLogout}
									role="menuitem"
									className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
								>
									로그아웃
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

import { Link, useLocation } from 'react-router-dom';
import { isActivePath, navigation } from '@/config/navigation';

interface IAdminSidebarProps {
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
}

export function AdminSidebar({ sidebarCollapsed, onToggleSidebar }: IAdminSidebarProps) {
	const location = useLocation();

	return (
		<aside
			className={`admin-sidebar bg-gray-900 text-white transition-all duration-300 ease-in-out ${
				sidebarCollapsed ? 'w-16' : 'w-64'
			}`}
			aria-label="사이드바 내비게이션"
			aria-expanded={!sidebarCollapsed}
		>
			<div className="flex flex-col h-full">
				{/* 로고 & 토글 버튼 */}
				<div className="flex items-center justify-between h-16 px-3 border-b border-gray-800">
					{!sidebarCollapsed && <h1 className="font-bold text-lg tracking-tight">PickID Admin</h1>}
					<button
						onClick={onToggleSidebar}
						className="text-gray-300 hover:text-white p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
						aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
						title={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
					>
						<span className="text-lg" aria-hidden="true">
							{sidebarCollapsed ? '→' : '←'}
						</span>
					</button>
				</div>

				{/* 네비게이션 메뉴 */}
				<nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto" role="navigation">
					{navigation.map((entry, idx) => {
						// 섹션 헤더
						if (entry.type === 'section') {
							return (
								<div
									key={`section-${entry.name}-${idx}`}
									className={`pt-4 ${idx !== 0 ? 'mt-2 border-t border-gray-800' : ''}`}
								>
									{!sidebarCollapsed && (
										<div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
											{entry.name}
										</div>
									)}
								</div>
							);
						}

						// 메뉴 아이템
						const isActive = isActivePath(location.pathname, entry);
						const baseClasses =
							'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/50';
						const activeClasses = 'bg-blue-600 text-white shadow-md';
						const inactiveClasses = 'text-gray-300 hover:bg-gray-800 hover:text-white';

						return (
							<Link
								key={entry.name}
								to={entry.href}
								className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
								aria-current={isActive ? 'page' : undefined}
								title={sidebarCollapsed ? entry.name : undefined}
							>
								{/* 아이콘 */}
								<span className="mr-3 text-lg flex-shrink-0" aria-hidden="true">
									{entry.icon}
								</span>

								{/* 메뉴명 & 뱃지 */}
								{!sidebarCollapsed && (
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2">
											<span className="truncate">{entry.name}</span>
											{entry.badge && (
												<span className="shrink-0 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
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
	);
}

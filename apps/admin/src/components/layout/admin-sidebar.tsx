import { Link, useLocation } from 'react-router-dom';
import { isActivePath, navigation } from '@/config/navigation';

interface AdminSidebarProps {
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
}

function NavSectionComponent({ name, isCollapsed }: { name: string; isCollapsed: boolean }) {
	if (isCollapsed) return null;
	return <div className="px-3 py-2 text-xs uppercase text-neutral-500 tracking-wide font-medium">{name}</div>;
}

function NavItemComponent({
	entry,
	isActive,
	isCollapsed,
}: {
	entry: { name: string; href: string; icon: React.ReactNode; description?: string; badge?: string | number };
	isActive: boolean;
	isCollapsed: boolean;
}) {
	return (
		<Link
			to={entry.href}
			className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
				isActive
					? 'bg-neutral-100 text-neutral-900'
					: 'text-neutral-700 hover:bg-neutral-100'
			}`}
			aria-current={isActive ? 'page' : undefined}
			title={isCollapsed ? entry.name : undefined}
		>
			<div className="w-4 mr-3 text-neutral-600 flex items-center justify-center">{entry.icon}</div>
			{!isCollapsed && (
				<div className="flex-1 flex items-center justify-between">
					<span>{entry.name}</span>
					{entry.badge && (
						<span className="w-5 h-5 bg-neutral-500 rounded-full flex items-center justify-center">
							<span className="text-xs text-white">{entry.badge}</span>
						</span>
					)}
				</div>
			)}
		</Link>
	);
}

export function AdminSidebar({ sidebarCollapsed, onToggleSidebar }: AdminSidebarProps) {
	const location = useLocation();

	const renderNavItems = () => {
		const items: React.ReactNode[] = [];
		let sectionIndex = 0;

		navigation.forEach((entry, idx) => {
			if (entry.type === 'section') {
				if (idx > 0) {
					items.push(<div key={`divider-${sectionIndex}`} className="border-t border-neutral-200 my-4" />);
				}
				items.push(
					<NavSectionComponent key={`section-${entry.name}`} name={entry.name} isCollapsed={sidebarCollapsed} />
				);
				sectionIndex++;
				return;
			}

			if (entry.type === 'item' && entry.href) {
				const isActive = isActivePath(location.pathname, entry);
				items.push(
					<li key={entry.name}>
						<NavItemComponent
							entry={{ name: entry.name, href: entry.href, icon: entry.icon, description: entry.description }}
							isActive={isActive}
							isCollapsed={sidebarCollapsed}
						/>
					</li>
				);
			}
		});

		return items;
	};

	return (
		<aside
			className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-neutral-200 bg-white flex flex-col transition-all duration-300`}
			aria-label="사이드바 내비게이션"
		>
			<div className="flex flex-col h-full">
				<div className="p-6 border-b border-neutral-200">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center mr-3">
							<span className="text-white text-sm font-bold">P</span>
						</div>
						{!sidebarCollapsed && (
							<div>
								<div className="text-neutral-900 font-semibold">PickID</div>
								<div className="text-xs text-neutral-500">Admin</div>
							</div>
						)}
					</div>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<ul className="space-y-2">{renderNavItems()}</ul>
				</nav>

				<div className="p-4 border-t border-neutral-200">
					<button
						onClick={onToggleSidebar}
						className="w-full flex items-center justify-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
						aria-label="사이드바 토글"
					>
						<span className="text-lg">{sidebarCollapsed ? '→' : '←'}</span>
					</button>
				</div>
			</div>
		</aside>
	);
}

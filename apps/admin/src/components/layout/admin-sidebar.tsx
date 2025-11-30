import { Link, useLocation } from 'react-router-dom';
import { isActivePath, navigation } from '@/config/navigation';

interface AdminSidebarProps {
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
}

function NavSectionComponent({ name, isCollapsed }: { name: string; isCollapsed: boolean }) {
	if (isCollapsed) return null;
	return <div className="px-2 py-2 text-xs uppercase text-gray-400 font-medium">{name}</div>;
}

function NavItemComponent({
	entry,
	isActive,
	isCollapsed,
}: {
	entry: { name: string; href: string; icon: string; description?: string; badge?: string | number };
	isActive: boolean;
	isCollapsed: boolean;
}) {
	return (
		<Link
			to={entry.href}
			className={`flex items-center px-3 py-2 text-sm rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
			aria-current={isActive ? 'page' : undefined}
			title={isCollapsed ? entry.name : undefined}
		>
			<span className="text-lg mr-3">{entry.icon}</span>
			{!isCollapsed && (
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<span>{entry.name}</span>
						{entry.badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">{entry.badge}</span>}
					</div>
					{entry.description && <p className="text-xs text-gray-400 mt-0.5">{entry.description}</p>}
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
					items.push(<div key={`divider-${sectionIndex}`} className="border-t border-gray-800 my-2" />);
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
					<NavItemComponent
						key={entry.name}
						entry={{ name: entry.name, href: entry.href, icon: entry.icon, description: entry.description }}
						isActive={isActive}
						isCollapsed={sidebarCollapsed}
					/>
				);
			}
		});

		return items;
	};

	return (
		<aside className={`bg-gray-900 text-white ${sidebarCollapsed ? 'w-16' : 'w-64'}`} aria-label="사이드바 내비게이션">
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-16 px-3 border-b border-gray-800">
					{!sidebarCollapsed && <h1 className="font-bold text-lg">PickID Admin</h1>}
					<button onClick={onToggleSidebar} className="text-gray-300 p-1.5" aria-label="사이드바 토글">
						<span className="text-lg">{sidebarCollapsed ? '→' : '←'}</span>
					</button>
				</div>

				<nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">{renderNavItems()}</nav>
			</div>
		</aside>
	);
}

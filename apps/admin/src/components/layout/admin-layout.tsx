import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { PATH } from '@/constants/routes';

export function AdminLayout() {
	const navigate = useNavigate();
	const { adminUser, loading, logout } = useAdminAuth();

	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem('admin.sidebarCollapsed');
		if (saved !== null) return saved === '1';
		return window.matchMedia('(max-width: 1024px)').matches;
	});

	useEffect(() => {
		localStorage.setItem('admin.sidebarCollapsed', sidebarCollapsed ? '1' : '0');
	}, [sidebarCollapsed]);

	useEffect(() => {
		if (!loading && !adminUser) {
			navigate(PATH.AUTH, { replace: true });
		}
	}, [loading, adminUser, navigate]);

	if (loading || !adminUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	const handleToggleSidebar = () => {
		setSidebarCollapsed((prev) => !prev);
	};

	return (
		<div className="flex h-screen bg-white">
			<AdminSidebar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<AdminHeader user={adminUser} onLogout={logout} />

				<main className="flex-1 overflow-auto bg-white">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

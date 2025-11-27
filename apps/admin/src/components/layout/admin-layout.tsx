import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { PATH } from '@/constants/routes';

export function AdminLayout() {
	const navigate = useNavigate();
	const { adminUser, loading, logout } = useAdminAuth();

	// 사이드바 상태 관리 (localStorage 기반)
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem('admin.sidebarCollapsed');
		if (saved !== null) return saved === '1';
		return window.matchMedia('(max-width: 1024px)').matches;
	});

	// 사이드바 상태 변경시 localStorage 저장
	useEffect(() => {
		localStorage.setItem('admin.sidebarCollapsed', sidebarCollapsed ? '1' : '0');
	}, [sidebarCollapsed]);

	// 인증 체크 및 리다이렉트 (로딩 완료 후에만 체크)
	useEffect(() => {
		if (!loading && !adminUser) {
			navigate(PATH.AUTH, { replace: true });
		}
	}, [loading, adminUser, navigate]);

	// 로딩 중이거나 인증되지 않은 상태
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
		<div className="admin-layout flex h-screen bg-gray-50 text-gray-900">
			{/* 사이드바 */}
			<AdminSidebar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} />

			{/* 메인 콘텐츠 영역 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* 헤더 */}
				<AdminHeader user={adminUser} onLogout={logout} />

				{/* 페이지 콘텐츠 */}
				<main className="animate-[fadeIn_200ms_ease-out] admin-content flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingState } from '@/components/ui';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';

export function AdminLayout() {
	const navigate = useNavigate();
	const { adminUser, loading, logout } = useAdminAuth();

	// 사이드바 상태 관리
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem('admin.sidebarCollapsed');
		return saved ? saved === '1' : window.matchMedia('(max-width: 1024px)').matches;
	});

	// 사이드바 상태 저장
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

	// 로딩 중일 때
	if (loading) {
		return <LoadingState message="로딩 중..." className="h-screen" />;
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
			<AdminSidebar
				sidebarCollapsed={sidebarCollapsed}
				onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>

			{/* 메인 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<AdminHeader adminUser={adminUser} onLogout={logout} />

				{/* 콘텐츠 */}
				<main className="animate-[fadeIn_200ms_ease-out] admin-content flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

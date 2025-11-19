import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from '@/pages/auth/admin-login-page';
import { AdminLayout } from '@/components/layout';
import { SimplifiedDashboard } from '@/pages/dashboard-page';
import { TestListPage } from '@/pages/tests/test-list-page';
import CategoryListPage from '@/pages/categories/category-list-page';
import { FeedbackListPage } from '@/pages/feedback/feedback-list-page';
import { UserListPage } from '@/pages/users/user-list-page';
import { CreateTestPage } from '@/pages/tests/create-test-page';
import { EditTestPage } from '@/pages/tests/edit-test-page';
import { UserResponsesPage } from '@/pages/responses/user-responses-page';
import { AnalyticsPage } from '@/pages/analytics/analytics-page';
import { AnalyticsTestDetailPage } from '@/pages/analytics/analytics-test-detail-page';
import { GrowthPage } from '@/pages/growth/growth-pages';
// import SettingsPage from '@/pages/settings/settings-page';

export function AppRoutes() {
	return (
		<Routes>
			{/* 관리자 로그인 페이지 */}
			<Route path="/auth" element={<AdminLoginPage />} />

			{/* 관리자 대시보드 (보호된 라우트) */}
			<Route path="/" element={<AdminLayout />}>
				<Route index element={<SimplifiedDashboard />} />
				<Route path="users" element={<UserListPage />} />
				<Route path="feedbacks" element={<FeedbackListPage />} />
				<Route path="tests" element={<TestListPage />} />
				<Route path="tests/create" element={<CreateTestPage />} />
				<Route path="tests/:id/edit" element={<EditTestPage />} />
				<Route path="categories" element={<CategoryListPage />} />
				<Route path="responses" element={<UserResponsesPage />} />
				<Route path="analytics" element={<AnalyticsPage />} />
				<Route path="analytics/tests/:id" element={<AnalyticsTestDetailPage />} />
				<Route path="growth" element={<GrowthPage />} />
				{/* <Route path="settings" element={<SettingsPage />} /> */}
			</Route>

			{/* 기본 리다이렉트 */}
			<Route path="*" element={<Navigate to="/auth" replace />} />
		</Routes>
	);
}

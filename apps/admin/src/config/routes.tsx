import { AdminLayout } from '@/components/layout';
import { PATH } from '@/constants/routes';
import { AnalyticsPage } from '@/pages/analytics/analytics-page';
import { AnalyticsTestDetailPage } from '@/pages/analytics/analytics-test-detail-page';
import { AdminLoginPage } from '@/pages/auth/admin-login-page';
import CategoryListPage from '@/pages/categories/category-list-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { FeedbackListPage } from '@/pages/feedback/feedback-list-page';
import { GrowthPage } from '@/pages/growth/growth-pages';
import { UserResponsesPage } from '@/pages/responses/user-responses-page';
import { CreateTestPage } from '@/pages/tests/create-test-page';
import { EditTestPage } from '@/pages/tests/edit-test-page';
import { TestListPage } from '@/pages/tests/test-list-page';
import { UserListPage } from '@/pages/users/user-list-page';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TestCreationFormProvider } from '@/providers/TestCreationFormProvider';

export function AppRoutes() {
	return (
		<Routes>
			<Route path={PATH.AUTH} element={<AdminLoginPage />} />

			<Route path={PATH.INDEX} element={<AdminLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path={PATH.USERS} element={<UserListPage />} />
				<Route path={PATH.FEEDBACKS} element={<FeedbackListPage />} />
				<Route path={PATH.TESTS} element={<TestListPage />} />
				<Route
					path={PATH.TEST_CREATE}
					element={
						<TestCreationFormProvider>
							<CreateTestPage />
						</TestCreationFormProvider>
					}
				/>
				<Route
					path={PATH.TEST_EDIT}
					element={
						<TestCreationFormProvider>
							<EditTestPage />
						</TestCreationFormProvider>
					}
				/>
				<Route path={PATH.CATEGORIES} element={<CategoryListPage />} />
				<Route path={PATH.RESPONSES} element={<UserResponsesPage />} />
				<Route path={PATH.ANALYTICS} element={<AnalyticsPage />} />
				<Route path={PATH.ANALYTICS_TEST_DETAIL} element={<AnalyticsTestDetailPage />} />
				<Route path={PATH.GROWTH} element={<GrowthPage />} />
			</Route>

			<Route path="*" element={<Navigate to={PATH.AUTH} replace />} />
		</Routes>
	);
}

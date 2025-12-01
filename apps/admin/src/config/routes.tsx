import { AdminLayout } from '@/components/layout';
import { ROUTES, HREF } from '@/constants/routes';
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
			<Route path={ROUTES.auth} element={<AdminLoginPage />} />

			<Route path={ROUTES.home} element={<AdminLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path={ROUTES.users} element={<UserListPage />} />
				<Route path={ROUTES.feedbacks} element={<FeedbackListPage />} />
				<Route path={ROUTES.tests} element={<TestListPage />} />
				<Route
					path={ROUTES.testCreate}
					element={
						<TestCreationFormProvider>
							<CreateTestPage />
						</TestCreationFormProvider>
					}
				/>
				<Route
					path={HREF.testEdit(':testId')}
					element={
						<TestCreationFormProvider>
							<EditTestPage />
						</TestCreationFormProvider>
					}
				/>
				<Route path={ROUTES.categories} element={<CategoryListPage />} />
				<Route path={ROUTES.responses} element={<UserResponsesPage />} />
				<Route path={ROUTES.analytics} element={<AnalyticsPage />} />
				<Route path={HREF.analyticsTest(':testId')} element={<AnalyticsTestDetailPage />} />
				<Route path={ROUTES.growth} element={<GrowthPage />} />
			</Route>

			<Route path="*" element={<Navigate to={ROUTES.auth} replace />} />
		</Routes>
	);
}

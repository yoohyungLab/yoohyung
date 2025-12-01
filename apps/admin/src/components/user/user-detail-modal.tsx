import { EmptyState, LoadingState } from '@/components/ui';
import { AdminCard, AdminCardContent, AdminCardHeader } from '@/components/ui/admin-card';
import { formatDate } from '@pickid/shared';
import { USER_STATUSES } from '@/constants';
import { userService } from '@/services';
import { formatDuration } from '@pickid/shared';
import type { Feedback, UserActivityItem, UserWithActivity } from '@pickid/supabase';
import { Badge, IconBadge, IconButton } from '@pickid/ui';
import { Activity, Calendar, Clock, Hash, Mail, MessageSquare, Target, TrendingUp, User, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
interface UserDetailModalProps {
	user: UserWithActivity;
	onClose: () => void;
}

type TabType = 'basic' | 'activity' | 'tests' | 'feedbacks';

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
	const [activeTab, setActiveTab] = useState<TabType>('basic');
	const [activities, setActivities] = useState<UserActivityItem[]>([]);
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState(true);

	const loadActivities = useCallback(async () => {
		setLoading(true);
		try {
			const [activitiesData, feedbacksData] = await Promise.all([
				userService.getUserActivity(user.id),
				userService.getUserFeedbacks(user.id),
			]);

			setActivities(activitiesData);
			setFeedbacks(feedbacksData);
		} catch {
			setActivities([]);
			setFeedbacks([]);
		}
		setLoading(false);
	}, [user.id]);

	useEffect(() => {
		loadActivities();
	}, [loadActivities]);

	const getStatusBadge = (status: string) => {
		const statusKey = status as keyof typeof USER_STATUSES;
		const config = USER_STATUSES[statusKey] || { value: status, label: '알수없음', variant: 'default' as const };
		return (
			<Badge variant={config.variant as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'}>
				{config.label}
			</Badge>
		);
	};

	const stats = {
		totalResponses: user.activity?.total_responses || 0,
		uniqueTests: user.activity?.unique_tests || 0,
		avgCompletionRate: user.activity?.avg_completion_rate ? user.activity.avg_completion_rate * 100 : 0,
		avgDuration: user.activity?.avg_duration_sec || 0,
		activityScore: user.activity?.activity_score || 0,
		feedbackCount: feedbacks.length,
	};

	const tabs = [
		{ id: 'basic', label: '기본 정보', icon: User },
		{ id: 'activity', label: '활동 통계', icon: Activity },
		{ id: 'tests', label: `테스트 기록 (${activities.length})`, icon: Target },
		{
			id: 'feedbacks',
			label: `건의사항 (${stats.feedbackCount})`,
			icon: MessageSquare,
		},
	] as const;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
			<div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
				<header className="p-6 border-b border-neutral-200 bg-white">
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start gap-4 flex-1">
							<div className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center shadow-sm">
								{user.avatar_url ? (
									<img src={user.avatar_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
								) : (
									<User className="w-10 h-10 text-white" />
								)}
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<h2 className="text-2xl font-bold text-neutral-900 truncate">{user.name || 'Unknown'}</h2>
								</div>

								<div className="flex items-center gap-3 mb-3">
									<IconBadge
										icon={
											USER_STATUSES[(user.status || 'active') as keyof typeof USER_STATUSES]?.icon || (
												<User className="w-3 h-3" />
											)
										}
										text={USER_STATUSES[(user.status || 'active') as keyof typeof USER_STATUSES]?.label || '알수없음'}
										variant="outline"
										className="bg-white"
									/>
									<IconBadge
										icon={<Mail className="w-3 h-3" />}
										text={
											user.provider === 'google'
												? '구글'
												: user.provider === 'kakao'
													? '카카오'
													: '이메일'
										}
										variant="outline"
										className="bg-white"
									/>
									<IconBadge
										icon={<Calendar className="w-3 h-3" />}
										text={formatDate(user.created_at || new Date(), {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
										variant="outline"
										className="bg-white"
									/>
								</div>
							</div>
						</div>

						<IconButton
							icon={<X className="h-4 w-4" />}
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="h-8 w-8 p-0 hover:bg-neutral-100"
							aria-label="닫기"
						/>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div className="bg-white rounded-lg p-3 border border-neutral-200">
							<div className="flex items-center gap-2 mb-1">
								<Target className="w-4 h-4 text-neutral-600" />
								<span className="text-sm text-neutral-600">참여 테스트</span>
							</div>
							<div className="text-lg font-semibold text-neutral-900">{stats.uniqueTests}</div>
						</div>
						<div className="bg-white rounded-lg p-3 border border-neutral-200">
							<div className="flex items-center gap-2 mb-1">
								<Users className="w-4 h-4 text-neutral-600" />
								<span className="text-sm text-neutral-600">총 응답</span>
							</div>
							<div className="text-lg font-semibold text-neutral-900">{stats.totalResponses}</div>
						</div>
						<div className="bg-white rounded-lg p-3 border border-neutral-200">
							<div className="flex items-center gap-2 mb-1">
								<TrendingUp className="w-4 h-4 text-neutral-600" />
								<span className="text-sm text-neutral-600">완료율</span>
							</div>
							<div className="text-lg font-semibold text-neutral-900">{stats.avgCompletionRate.toFixed(1)}%</div>
						</div>
					</div>

					<nav className="flex gap-1 mt-6 bg-neutral-50 rounded-lg p-1">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
										activeTab === tab.id
											? 'bg-white text-neutral-900 shadow-sm font-medium'
											: 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
									}`}
								>
									<Icon className="w-4 h-4" />
									<span className="text-sm">{tab.label}</span>
								</button>
							);
						})}
					</nav>
				</header>

				<main className="flex-1 overflow-y-auto bg-white">
					{activeTab === 'basic' && (
						<section className="p-6 space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<User className="w-5 h-5 text-neutral-600" />
												기본 정보
											</div>
										}
									/>
									<AdminCardContent className="space-y-4">
										<div>
											<label className="text-sm font-medium text-neutral-700">사용자 ID</label>
											<div className="mt-1 font-mono text-sm text-neutral-600">{user.id}</div>
										</div>
										<div>
											<label className="text-sm font-medium text-neutral-700">이름</label>
											<div className="mt-1 text-neutral-900">{user.name}</div>
										</div>
										<div>
											<label className="text-sm font-medium text-neutral-700">이메일</label>
											<div className="mt-1 text-neutral-900">{user.email}</div>
										</div>
									</AdminCardContent>
								</AdminCard>

								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Calendar className="w-5 h-5 text-neutral-600" />
												계정 정보
											</div>
										}
									/>
									<AdminCardContent className="space-y-4">
										<div className="grid grid-cols-1 gap-4 text-sm">
											<div>
												<span className="text-neutral-600">가입일</span>
												<div className="font-medium text-neutral-900">{formatDate(user.created_at || new Date())}</div>
											</div>
											<div>
												<span className="text-neutral-600">가입 경과일</span>
												<div className="font-medium text-neutral-900">
													{(() => {
														const created = typeof user.created_at === 'string' ? new Date(user.created_at) : user.created_at || new Date();
														const now = new Date();
														const nowInKorea = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
														const createdInKorea = new Date(created.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
														const nowDate = new Date(nowInKorea.getFullYear(), nowInKorea.getMonth(), nowInKorea.getDate());
														const createdDate = new Date(createdInKorea.getFullYear(), createdInKorea.getMonth(), createdInKorea.getDate());
														return Math.floor((nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
													})()}일
												</div>
											</div>
											<div>
												<span className="text-neutral-600">최근 수정일</span>
												<div className="font-medium text-neutral-900">{formatDate(user.updated_at || new Date())}</div>
											</div>
										</div>
									</AdminCardContent>
								</AdminCard>
							</div>
						</section>
					)}

					{activeTab === 'activity' && (
						<section className="p-6 space-y-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<AdminCard variant="info" padding="sm" className="bg-neutral-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-neutral-900">{stats.totalResponses}</div>
										<div className="text-sm text-neutral-600">총 응답수</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="success" padding="sm" className="bg-neutral-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-neutral-900">{stats.uniqueTests}</div>
										<div className="text-sm text-neutral-600">참여 테스트</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="modal" padding="sm" className="bg-neutral-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-neutral-900">{stats.avgCompletionRate.toFixed(1)}%</div>
										<div className="text-sm text-neutral-600">평균 완료율</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="warning" padding="sm" className="bg-neutral-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-neutral-900">{stats.activityScore}</div>
										<div className="text-sm text-neutral-600">활동 점수</div>
									</AdminCardContent>
								</AdminCard>
							</div>

							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<TrendingUp className="w-5 h-5 text-neutral-600" />
											상세 통계
										</div>
									}
								/>
								<AdminCardContent className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-neutral-600">평균 소요시간</span>
										<Badge variant="outline">{stats.avgDuration > 0 ? formatDuration(stats.avgDuration) : '-'}</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-neutral-600">완료율</span>
										<div className="flex items-center gap-2">
											<div className="w-20 bg-neutral-200 rounded-full h-2">
												<div
													className="bg-neutral-600 h-2 rounded-full transition-all duration-300"
													style={{ width: `${stats.avgCompletionRate}%` }}
												/>
											</div>
											<span className="text-sm font-medium">{stats.avgCompletionRate.toFixed(1)}%</span>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-neutral-600">인기 결과 유형</span>
										<Badge variant="outline">{user.activity?.top_result_type || '-'}</Badge>
									</div>
								</AdminCardContent>
							</AdminCard>
						</section>
					)}

					{activeTab === 'tests' && (
						<section className="p-6">
							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<Target className="w-5 h-5 text-neutral-600" />
											테스트 참여 기록
										</div>
									}
								/>
								<AdminCardContent>
									{loading ? (
										<LoadingState message="테스트 기록을 불러오는 중..." size="sm" className="py-8" />
									) : activities.length > 0 ? (
										<div className="space-y-3 max-h-96 overflow-y-auto">
											{activities.map((activity: UserActivityItem) => (
												<div
													key={activity.id}
													className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
												>
													<div className="flex items-start justify-between">
														<div className="flex items-start gap-3">
															<div className="text-2xl">{activity.test_emoji || '📝'}</div>
															<div className="flex-1">
																<h4 className="font-medium text-neutral-900 mb-1">{activity.test_title}</h4>
																<div className="text-sm text-neutral-500 space-y-1">
																	<div>
																		시작: {new Date(activity.started_at || new Date()).toLocaleDateString('ko-KR')}
																	</div>
																	{activity.completed_at && (
																		<div>완료: {new Date(activity.completed_at).toLocaleDateString('ko-KR')}</div>
																	)}
																</div>
															</div>
														</div>
														<div className="text-right space-y-1">
															{getStatusBadge(activity.status || 'pending')}
															{activity.result_type && activity.result_type !== '결과 없음' && (
																<div>
																	<Badge variant="outline">{activity.result_type}</Badge>
																</div>
															)}
															{(activity.duration_sec || 0) > 0 && (
																<div className="text-xs text-neutral-500 flex items-center gap-1">
																	<Clock className="w-3 h-3" />
																	{formatDuration(activity.duration_sec || 0)}
																</div>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<EmptyState
											title="테스트 참여 기록이 없습니다"
											message="아직 참여한 테스트가 없습니다."
											icon={<Target className="w-12 h-12 mx-auto text-neutral-300" />}
											className="py-12"
										/>
									)}
								</AdminCardContent>
							</AdminCard>
						</section>
					)}

					{activeTab === 'feedbacks' && (
						<section className="p-6">
							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<MessageSquare className="w-5 h-5 text-neutral-600" />
											건의사항 내역
										</div>
									}
								/>
								<AdminCardContent>
									{feedbacks.length > 0 ? (
										<div className="space-y-4 max-h-96 overflow-y-auto">
											{feedbacks.map((feedback: Feedback) => (
												<div
													key={feedback.id}
													className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
												>
													<div className="flex items-start justify-between mb-3">
														<h4 className="font-medium text-neutral-900">{feedback.title}</h4>
														<Badge variant="outline" className="text-xs">
															{feedback.status}
														</Badge>
													</div>

													<div className="text-sm text-neutral-600 mb-3">
														<div className="flex items-center gap-4">
															<IconBadge
																icon={<Hash className="w-3 h-3" />}
																text={feedback.category}
																variant="outline"
																className="text-xs"
															/>
															<IconBadge
																icon={<Calendar className="w-3 h-3" />}
																text={new Date(feedback.created_at).toLocaleDateString('ko-KR')}
																variant="outline"
																className="text-xs"
															/>
														</div>
													</div>

													{feedback.content && (
														<div className="text-sm text-neutral-700 mb-3 p-3 bg-neutral-50 rounded-lg">
															{feedback.content}
														</div>
													)}

													{feedback.admin_reply && (
														<div className="mt-3 p-3 bg-neutral-50 rounded-lg border-l-4 border-neutral-400">
															<div className="text-xs text-neutral-600 font-medium mb-1">관리자 답변</div>
															<div className="text-sm text-neutral-800">{feedback.admin_reply}</div>
															{feedback.admin_reply_at && (
																<div className="text-xs text-neutral-600 mt-1">
																	{new Date(feedback.admin_reply_at).toLocaleDateString('ko-KR')}
																</div>
															)}
														</div>
													)}
												</div>
											))}
										</div>
									) : (
										<EmptyState
											title="건의사항이 없습니다"
											message="아직 등록된 건의사항이 없습니다."
											icon={<MessageSquare className="w-12 h-12 mx-auto text-neutral-300" />}
											className="py-12"
										/>
									)}
								</AdminCardContent>
							</AdminCard>
						</section>
					)}
				</main>
			</div>
		</div>
	);
}

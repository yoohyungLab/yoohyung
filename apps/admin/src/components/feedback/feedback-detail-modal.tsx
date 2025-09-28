import { formatDateLong } from '@repo/shared';
import type { Feedback } from '@repo/supabase';
import { Badge, IconBadge, IconButton } from '@repo/ui';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import { Calendar, CheckCircle, Clock, Eye, Mail, MessageSquare, Paperclip, Reply, User, X } from 'lucide-react';
import { getPriorityColor, getStatusText } from '@/shared/lib/utils';

interface FeedbackDetailModalProps {
	feedback: Feedback;
	onClose: () => void;
	onReply: (id: string) => void;
}

export function FeedbackDetailModal(props: FeedbackDetailModalProps) {
	const { feedback, onClose, onReply } = props;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
			<div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
				{/* 헤더 */}
				<header className={`p-6 border-b border-gray-200 bg-gradient-to-r ${getPriorityColor(feedback.status)}`}>
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start gap-4 flex-1">
							{/* 카테고리 아이콘 */}
							<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
								<span className="text-2xl">💬</span>
							</div>

							{/* 건의사항 정보 */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<h2 className="text-2xl font-bold text-gray-900 truncate">{feedback.title}</h2>
									<Badge variant="outline" className="text-xs font-mono">
										#{feedback.id.slice(-8)}
									</Badge>
								</div>

								<div className="flex items-center gap-3 mb-3">
									<IconBadge
										icon={
											feedback.status === 'resolved' ? (
												<CheckCircle className="w-3 h-3" />
											) : feedback.status === 'in_progress' ? (
												<Clock className="w-3 h-3" />
											) : feedback.status === 'rejected' ? (
												<X className="w-3 h-3" />
											) : (
												<Clock className="w-3 h-3" />
											)
										}
										text={getStatusText(feedback.status)}
										variant="outline"
										className={`bg-white/80 ${
											feedback.status === 'resolved'
												? 'text-green-700 border-green-300'
												: feedback.status === 'in_progress'
												? 'text-blue-700 border-blue-300'
												: feedback.status === 'rejected'
												? 'text-red-700 border-red-300'
												: 'text-yellow-700 border-yellow-300'
										}`}
									/>
								</div>

								<div className="flex items-center gap-4 text-sm text-gray-600">
									<span className="flex items-center gap-1">
										<User className="w-4 h-4" />
										{feedback.author_name}
									</span>
									{feedback.author_email && (
										<span className="flex items-center gap-1">
											<Mail className="w-4 h-4" />
											{feedback.author_email}
										</span>
									)}
									<span className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{formatDateLong(feedback.created_at)}
									</span>
									<span className="flex items-center gap-1">
										<Eye className="w-4 h-4" />
										{feedback.views}회
									</span>
								</div>
							</div>
						</div>

						{/* 닫기 버튼 */}
						<IconButton
							icon={<X className="h-4 w-4" />}
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="h-8 w-8 p-0 hover:bg-white/80"
							aria-label="닫기"
						/>
					</div>

					{/* 빠른 액션 */}
					<div className="flex items-center justify-between">
						{feedback.attached_file_url && (
							<IconBadge
								icon={<Paperclip className="w-3 h-3" />}
								text="첨부파일 있음"
								variant="outline"
								className="bg-white/80"
							/>
						)}

						{!feedback.admin_reply && (
							<IconButton
								icon={<Reply className="w-4 h-4" />}
								label="답변하기"
								size="sm"
								onClick={() => onReply(feedback.id)}
								className="bg-white/90 hover:bg-white text-gray-900"
							/>
						)}
					</div>
				</header>

				{/* 콘텐츠 */}
				<main className="flex-1 overflow-y-auto bg-gray-50 p-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* 메인 콘텐츠 */}
						<section className="lg:col-span-2 space-y-6">
							{/* 건의사항 내용 */}
							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<MessageSquare className="w-5 h-5 text-blue-600" />
											건의사항 내용
										</div>
									}
								/>
								<AdminCardContent>
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
										<pre className="whitespace-pre-wrap text-gray-900 font-sans leading-relaxed">
											{feedback.content}
										</pre>
									</div>
								</AdminCardContent>
							</AdminCard>

							{/* 첨부파일 */}
							{feedback.attached_file_url && (
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Paperclip className="w-5 h-5 text-gray-600" />
												첨부파일
											</div>
										}
									/>
									<AdminCardContent>
										<div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
											<Paperclip className="w-5 h-5 text-gray-400" />
											<div className="flex-1">
												<div className="font-medium text-gray-900">첨부된 파일</div>
												<div className="text-sm text-gray-500">첨부파일을 확인하세요</div>
											</div>
											<IconButton
												icon={<Paperclip className="w-4 h-4" />}
												label="다운로드"
												variant="outline"
												size="sm"
											/>
										</div>
									</AdminCardContent>
								</AdminCard>
							)}

							{/* 관리자 답변 */}
							{feedback.admin_reply ? (
								<AdminCard variant="info" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Reply className="w-5 h-5 text-blue-600" />
												관리자 답변
												<IconBadge
													icon={<CheckCircle className="w-4 h-4" />}
													text="답변 완료"
													variant="outline"
													className="bg-green-100 text-green-700 border-green-300"
												/>
											</div>
										}
									/>
									<AdminCardContent>
										<div className="bg-white rounded-lg p-4 border border-blue-200">
											<pre className="whitespace-pre-wrap text-gray-900 font-sans leading-relaxed">
												{feedback.admin_reply}
											</pre>
											{feedback.admin_reply_at && (
												<div className="mt-4 pt-4 border-t border-blue-200">
													<div className="text-sm text-blue-600 flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														답변일: {formatDateLong(feedback.admin_reply_at)}
													</div>
												</div>
											)}
										</div>
									</AdminCardContent>
								</AdminCard>
							) : (
								<AdminCard variant="warning" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Reply className="w-5 h-5 text-yellow-600" />
												관리자 답변
												<IconBadge
													icon={<Clock className="w-4 h-4" />}
													text="답변 대기"
													variant="outline"
													className="bg-yellow-100 text-yellow-700 border-yellow-300"
												/>
											</div>
										}
									/>
									<AdminCardContent>
										<div className="text-center py-8 text-gray-500">
											<Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
											<p className="text-lg font-medium">답변을 기다리고 있습니다</p>
											<p className="text-sm">관리자가 검토 후 답변드리겠습니다</p>
										</div>
									</AdminCardContent>
								</AdminCard>
							)}
						</section>

						{/* 사이드바 정보 */}
						<aside className="space-y-6">
							{/* 처리 현황 */}
							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<Clock className="w-5 h-5 text-orange-600" />
											처리 현황
										</div>
									}
								/>
								<AdminCardContent className="space-y-3">
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-sm text-gray-600">접수일</span>
										<span className="text-sm font-medium">
											{new Date(feedback.created_at).toLocaleString('ko-KR', {
												year: 'numeric',
												month: '2-digit',
												day: '2-digit',
												hour: '2-digit',
												minute: '2-digit',
												hour12: false,
											})}
										</span>
									</div>
									{feedback.admin_reply_at && (
										<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
											<span className="text-sm text-gray-600">답변일</span>
											<span className="text-sm font-medium">
												{new Date(feedback.admin_reply_at).toLocaleString('ko-KR', {
													year: 'numeric',
													month: '2-digit',
													day: '2-digit',
													hour: '2-digit',
													minute: '2-digit',
													hour12: false,
												})}
											</span>
										</div>
									)}
									<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
										<span className="text-sm text-gray-600">처리 기간</span>
										<span className="text-sm font-medium">
											{feedback.admin_reply_at
												? `${Math.ceil(
														(new Date(feedback.admin_reply_at).getTime() - new Date(feedback.created_at).getTime()) /
															(1000 * 60 * 60 * 24)
												  )}일`
												: `${Math.ceil(
														(Date.now() - new Date(feedback.created_at).getTime()) / (1000 * 60 * 60 * 24)
												  )}일 경과`}
										</span>
									</div>
								</AdminCardContent>
							</AdminCard>
						</aside>
					</div>
				</main>
			</div>
		</div>
	);
}

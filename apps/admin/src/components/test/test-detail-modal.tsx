import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@repo/ui';
import { EmptyState } from '../ui';
import { formatDateLong } from '@repo/shared';
import { AdminCard, AdminCardHeader, AdminCardContent } from '../ui/admin-card';
import {
	X,
	Edit,
	Globe,
	Lock,
	Trash2,
	Copy,
	Calendar,
	Clock,
	BarChart3,
	Eye,
	Users,
	Play,
	CheckCircle,
	Circle,
	Hash,
	Target,
	MessageSquare,
	Image as ImageIcon,
} from 'lucide-react';
import type { Test, TestWithNestedDetails } from '@repo/supabase';
import { getTestTypeInfo, getTestStatusInfo } from '@/shared/lib/test-utils';
import { testService } from '@/shared/api/services/test.service';

type TestDetailModalProps = {
	test: Test;
	onClose: () => void;
	onTogglePublish: (testId: string, currentStatus: boolean) => void;
	onDelete: (testId: string) => void;
};

type TabType = 'basic' | 'questions' | 'results' | 'stats' | 'preview';

export function TestDetailModal({ test, onClose, onTogglePublish, onDelete }: TestDetailModalProps) {
	const [activeTab, setActiveTab] = useState<TabType>('basic');
	const [previewQuestionIndex, setPreviewQuestionIndex] = useState(-1);
	const [testDetails, setTestDetails] = useState<TestWithNestedDetails | null>(null);
	const [loading, setLoading] = useState(false);

	const typeInfo = getTestTypeInfo(test.type || 'psychology');
	const statusInfo = getTestStatusInfo(test.status || 'draft');

	// 테스트 상세 데이터 가져오기
	useEffect(() => {
		const fetchTestDetails = async () => {
			setLoading(true);
			try {
				const details = await testService.getTestWithDetails(test.id);
				setTestDetails(details);
			} catch (error) {
				console.error('테스트 상세 정보를 가져오는데 실패했습니다:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTestDetails();
	}, [test.id]);

	// 통계 계산
	const stats = {
		totalQuestions: testDetails?.questions?.length || 0,
		totalResults: testDetails?.results?.length || 0,
		avgChoicesPerQuestion: testDetails?.questions?.length
			? Math.round(
					(testDetails.questions.reduce((sum, q) => sum + (q.choices?.length || 0), 0) / testDetails.questions.length) *
						10
			  ) / 10
			: 0,
		questionsWithImages: testDetails?.questions?.filter((q) => q.image_url).length || 0,
		resultsWithTheme: testDetails?.results?.filter((r) => r.theme_color).length || 0,
		resultsWithImages: testDetails?.results?.filter((r) => r.background_image_url).length || 0,
		completionRate:
			test.response_count && test.view_count ? Math.round((test.response_count / test.view_count) * 100) : 0,
	};

	const tabs = [
		{ id: 'basic', label: '기본 정보', icon: Hash },
		{
			id: 'questions',
			label: `질문 (${stats.totalQuestions})`,
			icon: MessageSquare,
		},
		{ id: 'results', label: `결과 (${stats.totalResults})`, icon: Target },
		{ id: 'stats', label: '통계', icon: BarChart3 },
		{ id: 'preview', label: '미리보기', icon: Play },
	] as const;

	const handleTogglePublish = async () => {
		await onTogglePublish(test.id, test.status === 'published');
	};

	const handleDelete = () => {
		if (
			confirm('정말로 이 테스트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 응답 데이터도 함께 삭제됩니다.')
		) {
			onDelete(test.id);
			onClose();
		}
	};

	const handleDuplicate = () => {
		// 복제 로직 구현
		console.log('테스트 복제:', test.id);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
			<div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
				{/* 헤더 */}
				<div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start gap-4 flex-1">
							{/* 썸네일 */}
							<div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
								{test.thumbnail_url ? (
									<img src={test.thumbnail_url} alt={test.title} className="w-full h-full object-cover" />
								) : (
									<span className="text-2xl font-bold text-white">{test.title[0] || 'T'}</span>
								)}
							</div>

							{/* 제목 및 정보 */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<h2 className="text-2xl font-bold text-gray-900 truncate">{test.title}</h2>
									{test.short_code && (
										<div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-mono">
											{test.short_code}
										</div>
									)}
								</div>

								<div className="flex items-center gap-3 mb-3">
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white/80 text-sm">
										<span className="w-2 h-2 rounded-full bg-blue-500"></span>
										{typeInfo.name}
									</div>
									<div
										className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${
											test.status === 'published'
												? 'text-green-700 border-green-300 bg-white/80'
												: test.status === 'scheduled'
												? 'text-orange-700 border-orange-300 bg-white/80'
												: 'text-gray-700 border-gray-300 bg-white/80'
										}`}
									>
										{test.status === 'published' && <CheckCircle className="w-3 h-3" />}
										{test.status === 'scheduled' && <Clock className="w-3 h-3" />}
										{test.status === 'draft' && <Circle className="w-3 h-3" />}
										{statusInfo.name}
									</div>
									{test.estimated_time && (
										<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white/80 text-sm">
											<Clock className="w-3 h-3" />약 {test.estimated_time}분
										</div>
									)}
								</div>

								{test.description && <p className="text-gray-600 text-sm leading-relaxed">{test.description}</p>}
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

					{/* 빠른 통계 */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
							<div className="flex items-center gap-2">
								<Eye className="w-4 h-4 text-blue-600" />
								<span className="text-sm text-gray-600">조회수</span>
							</div>
							<div className="text-lg font-semibold text-gray-900">{(test.view_count || 0).toLocaleString()}</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-green-600" />
								<span className="text-sm text-gray-600">응답수</span>
							</div>
							<div className="text-lg font-semibold text-gray-900">{(test.response_count || 0).toLocaleString()}</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
							<div className="flex items-center gap-2">
								<MessageSquare className="w-4 h-4 text-purple-600" />
								<span className="text-sm text-gray-600">질문수</span>
							</div>
							<div className="text-lg font-semibold text-gray-900">{stats.totalQuestions}</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
							<div className="flex items-center gap-2">
								<Target className="w-4 h-4 text-orange-600" />
								<span className="text-sm text-gray-600">결과수</span>
							</div>
							<div className="text-lg font-semibold text-gray-900">{stats.totalResults}</div>
						</div>
					</div>

					{/* 탭 네비게이션 */}
					<div className="flex gap-1 mt-6 bg-white/40 rounded-lg p-1 backdrop-blur-sm">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
										activeTab === tab.id
											? 'bg-white text-blue-600 shadow-sm font-medium'
											: 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
									}`}
								>
									<Icon className="w-4 h-4" />
									<span className="text-sm">{tab.label}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* 콘텐츠 */}
				<div className="flex-1 overflow-y-auto bg-gray-50">
					{activeTab === 'basic' && (
						<div className="p-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* 기본 정보 */}
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Hash className="w-5 h-5 text-blue-600" />
												기본 정보
											</div>
										}
									/>
									<AdminCardContent className="space-y-4">
										<div className="grid grid-cols-1 gap-4">
											<div>
												<label className="text-sm font-medium text-gray-700">테스트 제목</label>
												<div className="mt-1 text-gray-900">{test.title}</div>
											</div>
											{test.description && (
												<div>
													<label className="text-sm font-medium text-gray-700">설명</label>
													<div className="mt-1 text-gray-900 text-sm leading-relaxed">{test.description}</div>
												</div>
											)}
											<div>
												<label className="text-sm font-medium text-gray-700">URL 슬러그</label>
												<div className="mt-1 font-mono text-sm text-blue-600">/{test.slug}</div>
											</div>
											{test.intro_text && (
												<div>
													<label className="text-sm font-medium text-gray-700">시작 문구</label>
													<div className="mt-1 text-gray-900 text-sm">{test.intro_text}</div>
												</div>
											)}
										</div>
									</AdminCardContent>
								</AdminCard>

								{/* 설정 정보 */}
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<Calendar className="w-5 h-5 text-green-600" />
												설정 정보
											</div>
										}
									/>
									<AdminCardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-600">생성일</span>
												<div className="font-medium text-gray-900">{formatDateLong(test.created_at)}</div>
											</div>
											<div>
												<span className="text-gray-600">수정일</span>
												<div className="font-medium text-gray-900">{formatDateLong(test.updated_at)}</div>
											</div>
											{test.published_at && (
												<div>
													<span className="text-gray-600">발행일</span>
													<div className="font-medium text-gray-900">{formatDateLong(test.published_at)}</div>
												</div>
											)}
											{test.scheduled_at && (
												<div>
													<span className="text-gray-600">예약 발행</span>
													<div className="font-medium text-gray-900">{formatDateLong(test.scheduled_at)}</div>
												</div>
											)}
											{test.max_score && (
												<div>
													<span className="text-gray-600">최대 점수</span>
													<div className="font-medium text-gray-900">{test.max_score}점</div>
												</div>
											)}
											<div>
												<span className="text-gray-600">완료율</span>
												<div className="flex items-center gap-2">
													<div className="flex-1 bg-gray-200 rounded-full h-2">
														<div
															className="bg-blue-500 h-2 rounded-full transition-all duration-300"
															style={{ width: `${stats.completionRate}%` }}
														/>
													</div>
													<span className="text-sm font-medium">{stats.completionRate}%</span>
												</div>
											</div>
										</div>
									</AdminCardContent>
								</AdminCard>
							</div>
						</div>
					)}

					{activeTab === 'questions' && (
						<div className="p-6">
							{/* 질문 개요 */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<AdminCard variant="info" padding="sm" className="bg-blue-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
										<div className="text-sm text-blue-700">총 질문 수</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="success" padding="sm" className="bg-green-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-green-600">{stats.avgChoicesPerQuestion}</div>
										<div className="text-sm text-green-700">평균 선택지</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="modal" padding="sm" className="bg-purple-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-purple-600">{stats.questionsWithImages}</div>
										<div className="text-sm text-purple-700">이미지 포함</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="warning" padding="sm" className="bg-orange-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-orange-600">
											{testDetails?.questions?.reduce((sum, q) => sum + (q.choices?.length || 0), 0) || 0}
										</div>
										<div className="text-sm text-orange-700">총 선택지</div>
									</AdminCardContent>
								</AdminCard>
							</div>

							{/* 질문 목록 */}
							<AdminCard variant="modal" padding="sm" className="mt-6">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<Target className="w-5 h-5 text-blue-600" />
											질문 목록
										</div>
									}
								/>
								<AdminCardContent>
									{loading ? (
										<div className="text-center py-8 text-gray-500">질문 데이터를 불러오는 중...</div>
									) : testDetails?.questions && testDetails.questions.length > 0 ? (
										<div className="max-h-96 overflow-y-auto">
											{testDetails.questions.map((question, index) => (
												<div
													key={question.id}
													className={`border border-gray-200 rounded-lg p-4 bg-white ${index > 0 ? 'mt-4' : ''}`}
												>
													<div className="flex items-start gap-3">
														<div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
															{index + 1}
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-2">
																<h4 className="font-medium text-gray-900">{question.question_text}</h4>
																{question.image_url && <ImageIcon className="w-4 h-4 text-gray-400" />}
															</div>
															{question.image_url && (
																<div className="mb-3">
																	<img
																		src={question.image_url}
																		alt="질문 이미지"
																		className="max-w-xs rounded-lg border border-gray-200"
																	/>
																</div>
															)}
															<div>
																{question.choices?.map((choice, choiceIndex) => (
																	<div
																		key={choice.id}
																		className={`flex items-center gap-2 text-sm ${choiceIndex > 0 ? 'mt-2' : ''}`}
																	>
																		<div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-xs">
																			{String.fromCharCode(65 + choiceIndex)}
																		</div>
																		<span className="text-gray-700">{choice.choice_text}</span>
																		{choice.score !== undefined && (
																			<span className="text-xs text-gray-500">({choice.score}점)</span>
																		)}
																	</div>
																))}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<EmptyState title="질문 데이터가 없습니다" icon="❓" className="py-8" />
									)}
								</AdminCardContent>
							</AdminCard>
						</div>
					)}

					{activeTab === 'results' && (
						<div className="p-6">
							{/* 결과 개요 */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<AdminCard variant="info" padding="sm" className="bg-blue-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-blue-600">{stats.totalResults}</div>
										<div className="text-sm text-blue-700">총 결과 수</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="success" padding="sm" className="bg-green-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-green-600">{stats.resultsWithTheme}</div>
										<div className="text-sm text-green-700">테마 색상</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="modal" padding="sm" className="bg-purple-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-purple-600">{stats.resultsWithImages}</div>
										<div className="text-sm text-purple-700">배경 이미지</div>
									</AdminCardContent>
								</AdminCard>
								<AdminCard variant="warning" padding="sm" className="bg-orange-50">
									<AdminCardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-orange-600">
											{testDetails?.results?.reduce(
												(sum, r) => sum + (r.features ? Object.keys(r.features).length : 0),
												0
											) || 0}
										</div>
										<div className="text-sm text-orange-700">총 키워드</div>
									</AdminCardContent>
								</AdminCard>
							</div>

							{/* 결과 목록 */}
							<AdminCard variant="modal" padding="sm" className="mt-6">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<MessageSquare className="w-5 h-5 text-green-600" />
											결과 목록
										</div>
									}
								/>
								<AdminCardContent>
									{loading ? (
										<div className="text-center py-8 text-gray-500">결과 데이터를 불러오는 중...</div>
									) : testDetails?.results && testDetails.results.length > 0 ? (
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
											{testDetails.results.map((result, index) => (
												<div key={result.id} className="border border-gray-200 rounded-lg p-4 bg-white">
													<div className="flex items-start gap-3">
														<div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium text-orange-600">
															{index + 1}
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-2">
																<h4 className="font-medium text-gray-900">{result.result_name}</h4>
																{result.theme_color && (
																	<div
																		className="w-4 h-4 rounded-full border border-gray-300"
																		style={{
																			backgroundColor: result.theme_color,
																		}}
																	/>
																)}
																{result.background_image_url && <ImageIcon className="w-4 h-4 text-gray-400" />}
															</div>
															{result.description && <p className="text-sm text-gray-600 mb-3">{result.description}</p>}
															{result.background_image_url && (
																<div className="mb-3">
																	<img
																		src={result.background_image_url}
																		alt="결과 배경 이미지"
																		className="max-w-xs rounded-lg border border-gray-200"
																	/>
																</div>
															)}
															<div>
																{result.match_conditions && Object.keys(result.match_conditions).length > 0 && (
																	<div className="text-xs">
																		<span className="text-gray-500">매칭 조건:</span>
																		<div className="mt-1 p-2 bg-gray-50 rounded text-gray-700 font-mono">
																			{JSON.stringify(result.match_conditions, null, 2)}
																		</div>
																	</div>
																)}
																{result.features && Object.keys(result.features).length > 0 && (
																	<div className="text-xs mt-2">
																		<span className="text-gray-500">특징:</span>
																		<div className="mt-1 flex flex-wrap gap-1">
																			{Object.entries(result.features).map(([key, value]) => (
																				<span key={key} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
																					{key}: {String(value)}
																				</span>
																			))}
																		</div>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8 text-gray-500">결과 데이터가 없습니다.</div>
									)}
								</AdminCardContent>
							</AdminCard>
						</div>
					)}

					{activeTab === 'stats' && (
						<div className="p-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* 참여 통계 */}
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<BarChart3 className="w-5 h-5 text-blue-600" />
												참여 통계
											</div>
										}
									/>
									<AdminCardContent>
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center p-4 bg-blue-50 rounded-lg">
												<div className="text-2xl font-bold text-blue-600">
													{(test.view_count || 0).toLocaleString()}
												</div>
												<div className="text-sm text-blue-700">총 조회수</div>
											</div>
											<div className="text-center p-4 bg-green-50 rounded-lg">
												<div className="text-2xl font-bold text-green-600">
													{(test.response_count || 0).toLocaleString()}
												</div>
												<div className="text-sm text-green-700">총 응답수</div>
											</div>
										</div>
										<div className="mt-4">
											<div className="flex justify-between text-sm">
												<span className="text-gray-600">완료율</span>
												<span className="font-medium">{stats.completionRate}%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
												<div
													className="bg-green-500 h-2 rounded-full transition-all duration-300"
													style={{ width: `${stats.completionRate}%` }}
												/>
											</div>
										</div>
									</AdminCardContent>
								</AdminCard>

								{/* 콘텐츠 통계 */}
								<AdminCard variant="modal" padding="sm">
									<AdminCardHeader
										variant="modal"
										title={
											<div className="text-lg flex items-center gap-2">
												<BarChart3 className="w-5 h-5 text-green-600" />
												콘텐츠 통계
											</div>
										}
									/>
									<AdminCardContent>
										<div>
											<div className="flex justify-between items-center">
												<span className="text-gray-600">총 질문 수</span>
												<span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-sm">
													{stats.totalQuestions}개
												</span>
											</div>
											<div className="flex justify-between items-center mt-3">
												<span className="text-gray-600">총 선택지 수</span>
												<span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-sm">
													{testDetails?.questions?.reduce((sum, q) => sum + (q.choices?.length || 0), 0) || 0}개
												</span>
											</div>
											<div className="flex justify-between items-center mt-3">
												<span className="text-gray-600">평균 선택지</span>
												<span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-sm">
													{stats.avgChoicesPerQuestion}개
												</span>
											</div>
											<div className="flex justify-between items-center mt-3">
												<span className="text-gray-600">총 결과 수</span>
												<span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-sm">
													{stats.totalResults}개
												</span>
											</div>
											<div className="flex justify-between items-center mt-3">
												<span className="text-gray-600">이미지 포함 질문</span>
												<span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-sm">
													{stats.questionsWithImages}개
												</span>
											</div>
										</div>
									</AdminCardContent>
								</AdminCard>
							</div>
						</div>
					)}

					{activeTab === 'preview' && (
						<div className="p-6">
							<AdminCard variant="modal" padding="sm">
								<AdminCardHeader
									variant="modal"
									title={
										<div className="text-lg flex items-center gap-2">
											<Play className="w-5 h-5 text-blue-600" />
											테스트 미리보기
										</div>
									}
								/>
								<AdminCardContent>
									<div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
										<div className="max-w-md mx-auto">
											{/* 시작 화면 */}
											{previewQuestionIndex === -1 && (
												<div className="text-center">
													<div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
														{test.title[0] || 'T'}
													</div>
													<div className="mt-6">
														<h3 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h3>
														<p className="text-gray-600 leading-relaxed">
															{test.intro_text || test.description || '테스트를 시작해보세요!'}
														</p>
													</div>
													<div className="text-sm text-gray-500 mt-4">
														<div>총 {stats.totalQuestions}개 질문</div>
														{test.estimated_time && (
															<div className="mt-1">예상 소요시간: 약 {test.estimated_time}분</div>
														)}
													</div>
													<Button
														onClick={() => setPreviewQuestionIndex(0)}
														className="w-full py-3 text-lg"
														disabled={!testDetails?.questions || testDetails.questions.length === 0}
													>
														{testDetails?.questions && testDetails.questions.length > 0
															? '테스트 시작하기'
															: '질문이 없습니다'}
													</Button>
												</div>
											)}

											{/* 질문이 없을 때 */}
											{previewQuestionIndex >= 0 && (!testDetails?.questions || testDetails.questions.length === 0) && (
												<div className="text-center py-8 text-gray-500">질문 데이터가 없습니다.</div>
											)}

											{/* 질문 화면 */}
											{previewQuestionIndex >= 0 && previewQuestionIndex < (testDetails?.questions?.length || 0) && (
												<div>
													<div className="text-center">
														<div className="text-sm text-gray-500 mb-4">
															질문 {previewQuestionIndex + 1} / {testDetails?.questions?.length || 0}
														</div>
														<h3 className="text-xl font-semibold text-gray-900 mb-6">
															{testDetails?.questions?.[previewQuestionIndex]?.question_text}
														</h3>
														{testDetails?.questions?.[previewQuestionIndex]?.image_url && (
															<div className="mb-6">
																<img
																	src={testDetails.questions[previewQuestionIndex].image_url!}
																	alt="질문 이미지"
																	className="max-w-sm mx-auto rounded-lg border border-gray-200"
																/>
															</div>
														)}
														<div className="max-w-md mx-auto">
															{testDetails?.questions?.[previewQuestionIndex]?.choices?.map((choice, choiceIndex) => (
																<button
																	key={choice.id}
																	onClick={() => {
																		if (previewQuestionIndex < (testDetails?.questions?.length || 0) - 1) {
																			setPreviewQuestionIndex(previewQuestionIndex + 1);
																		} else {
																			setPreviewQuestionIndex(999); // 결과 화면으로
																		}
																	}}
																	className={`w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
																		choiceIndex > 0 ? 'mt-3' : ''
																	}`}
																>
																	<div className="flex items-center gap-3">
																		<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
																			{String.fromCharCode(65 + choiceIndex)}
																		</div>
																		<span className="text-gray-900">{choice.choice_text}</span>
																	</div>
																</button>
															))}
														</div>
													</div>
												</div>
											)}

											{/* 결과 화면 */}
											{previewQuestionIndex >= 999 && (
												<div className="text-center">
													<div className="text-6xl mb-4">🎉</div>
													<div>
														<h3 className="text-2xl font-bold text-gray-900 mb-2">테스트 완료!</h3>
														<p className="text-gray-600 leading-relaxed mb-4">테스트가 완료되었습니다!</p>
														{testDetails?.results && testDetails.results.length > 0 && (
															<div className="bg-white rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
																<div className="flex items-center gap-3 mb-3">
																	{testDetails.results[0].theme_color && (
																		<div
																			className="w-8 h-8 rounded-full border border-gray-300"
																			style={{
																				backgroundColor: testDetails.results[0].theme_color,
																			}}
																		/>
																	)}
																	<h4 className="font-semibold text-gray-900">{testDetails.results[0].result_name}</h4>
																</div>
																{testDetails.results[0].description && (
																	<p className="text-sm text-gray-600">{testDetails.results[0].description}</p>
																)}
															</div>
														)}
													</div>
													<Button onClick={() => setPreviewQuestionIndex(-1)} variant="outline" className="w-full mt-6">
														다시 시작하기
													</Button>
												</div>
											)}
										</div>
									</div>
								</AdminCardContent>
							</AdminCard>
						</div>
					)}
				</div>

				{/* 하단 액션 버튼 */}
				<div className="p-6 border-t border-gray-200 bg-white">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300 text-xs">
								<Clock className="w-3 h-3" />
								{test.estimated_time ? `약 ${test.estimated_time}분` : '시간 미설정'}
							</div>
							<div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300 text-xs">
								<Users className="w-3 h-3" />
								{(test.response_count || 0).toLocaleString()}명 참여
							</div>
							<div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300 text-xs">
								<Eye className="w-3 h-3" />
								{(test.view_count || 0).toLocaleString()}회 조회
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={handleDuplicate}>
								<Copy className="w-4 h-4 mr-2" />
								복제하기
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleTogglePublish}
								className={
									test.status === 'published'
										? 'text-yellow-600 border-yellow-300 hover:bg-yellow-50'
										: 'text-green-600 border-green-300 hover:bg-green-50'
								}
							>
								{test.status === 'published' ? (
									<>
										<Lock className="w-4 h-4 mr-2" />
										비공개 전환
									</>
								) : (
									<>
										<Globe className="w-4 h-4 mr-2" />
										공개 전환
									</>
								)}
							</Button>
							<Button
								size="sm"
								onClick={() => {
									// 수정 페이지로 이동하는 로직
									window.location.href = `/tests/${test.id}/edit`;
								}}
							>
								<Edit className="w-4 h-4 mr-2" />
								수정하기
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleDelete}
								className="text-red-600 border-red-300 hover:bg-red-50"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								삭제하기
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

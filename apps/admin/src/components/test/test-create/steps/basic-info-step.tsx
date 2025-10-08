import React from 'react';
import { DefaultInput, DefaultSelect, DefaultTextarea, IconButton, Switch, Button } from '@pickid/ui';
import { LoadingState } from '@/components/ui';
import { X, RefreshCw } from 'lucide-react';
import { useCategories } from '@/hooks';
import { ThumbnailUpload } from '../components';
import type { BasicInfo } from '../types';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';

interface BasicInfoStepProps {
	testData: BasicInfo;
	selectedType: string;
	onUpdateTestData: (data: Partial<BasicInfo>) => void;
	onUpdateTitle: (title: string) => void;
	onRegenerateShortCode?: () => void;
	// 성별 필드 관련 props
	onAddGenderField?: () => void;
	onRemoveGenderField?: () => void;
	onUpdateGenderField?: (updates: any) => void;
	onUpdateResultVariantRules?: (rules: any) => void;
}

export const BasicInfoStep = (props: BasicInfoStepProps) => {
	const {
		testData,
		selectedType,
		onUpdateTestData,
		onUpdateTitle,
		onRegenerateShortCode,
		onAddGenderField,
		onRemoveGenderField,
		onUpdateGenderField,
		onUpdateResultVariantRules,
	} = props;

	const { categories, loading, error, fetchCategories } = useCategories();

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 왼쪽: 기본 정보 */}
				<div className="space-y-6">
					<DefaultInput
						label="테스트 제목"
						required
						value={testData.title}
						onChange={(e) => onUpdateTitle(e.target.value)}
						placeholder="예: 나는 어떤 MBTI 유형일까?"
					/>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">테스트 코드 (공유용)</label>
						<div className="flex gap-2">
							<DefaultInput
								value={testData.short_code}
								onChange={(e) => onUpdateTestData({ ...testData, short_code: e.target.value })}
								placeholder="예: ABC123"
								className="flex-1"
							/>
							{onRegenerateShortCode && (
								<Button
									type="button"
									variant="outline"
									onClick={onRegenerateShortCode}
									className="px-3 py-2"
									title="새 코드 생성"
								>
									<RefreshCw className="w-4 h-4" />
								</Button>
							)}
						</div>
						<p className="text-sm text-gray-500 mt-1">테스트 공유 시 사용할 고유 코드입니다. (예: /t/ABC123)</p>
					</div>

					<DefaultTextarea
						label="테스트 설명"
						value={testData.description || ''}
						onChange={(e) => onUpdateTestData({ ...testData, description: e.target.value || null })}
						placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
						rows={3}
					/>

					<DefaultTextarea
						label="시작 문구"
						value={testData.intro_text || ''}
						onChange={(e) => onUpdateTestData({ ...testData, intro_text: e.target.value || null })}
						placeholder="테스트 시작 전 사용자에게 보여줄 문구를 입력하세요"
						rows={3}
					/>

					<div className="grid grid-cols-2 gap-4">
						<DefaultSelect
							label="예상 소요 시간"
							value={testData.estimated_time?.toString()}
							onValueChange={(value: string) =>
								onUpdateTestData({
									...testData,
									estimated_time: parseInt(value),
								})
							}
							options={[
								{ value: '1', label: '1분 (초단편)' },
								{ value: '3', label: '3분 (빠른 테스트)' },
								{ value: '5', label: '5분 (표준)' },
								{ value: '10', label: '10분 (상세)' },
								{ value: '15', label: '15분 (심화)' },
							]}
							placeholder="소요 시간을 선택하세요"
						/>

						{selectedType === 'psychology' && (
							<DefaultInput
								label="최대 점수"
								type="number"
								value={testData.max_score}
								onChange={(e) =>
									onUpdateTestData({
										...testData,
										max_score: parseInt(e.target.value) || 100,
									})
								}
								min="10"
								max="1000"
							/>
						)}
					</div>
				</div>

				{/* 오른쪽: 비주얼 설정 */}
				<div className="space-y-6">
					<ThumbnailUpload
						thumbnailUrl={testData.thumbnail_url || ''}
						onUpdateThumbnail={(url) => onUpdateTestData({ ...testData, thumbnail_url: url })}
					/>

					<div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								카테고리 <span className="text-red-500">*</span>
							</label>
							{error ? (
								<div className="text-center py-4">
									<p className="text-red-500 mb-2">{error}</p>
									<IconButton
										onClick={() => fetchCategories()}
										icon={<X className="w-4 h-4" />}
										label="다시 시도"
										variant="outline"
										size="sm"
									/>
								</div>
							) : loading ? (
								<LoadingState message="카테고리를 불러오는 중..." size="sm" className="py-4" />
							) : (
								<div className="grid grid-cols-2 gap-2">
									{categories.map((category) => (
										<button
											key={category.id}
											onClick={() => {
												const newIds = testData.category_ids.includes(category.id)
													? testData.category_ids.filter((id: string) => id !== category.id)
													: [...testData.category_ids, category.id];
												onUpdateTestData({ ...testData, category_ids: newIds });
											}}
											className={`p-3 border rounded-lg text-left transition-all ${
												testData.category_ids.includes(category.id)
													? 'border-blue-500 bg-blue-50 text-blue-800'
													: 'border-gray-200 hover:border-gray-300'
											}`}
										>
											<div>
												<span className="text-sm font-medium">{category.name}</span>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* 성별 필드 설정 */}
			<AdminCard variant="modal" padding="sm">
				<AdminCardHeader
					variant="modal"
					title={
						<div className="text-lg flex items-center gap-2">
							<span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
								👤
							</span>
							성별 필드 설정
						</div>
					}
				/>
				<AdminCardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
						<div>
							<div className="text-base font-medium">성별 선택 필드 추가</div>
							<p className="text-sm text-gray-600">
								테스트 시작 전에 성별을 선택하도록 합니다.
								{testData.pre_questions?.some((field) => field.key === 'gender') ? ' (현재 활성화됨)' : ' (선택사항)'}
							</p>
						</div>
						<Switch
							checked={testData.pre_questions?.some((field) => field.key === 'gender') || false}
							onCheckedChange={(checked) => {
								if (checked) {
									onAddGenderField?.();
								} else {
									onRemoveGenderField?.();
								}
							}}
						/>
					</div>

					{testData.pre_questions?.some((field) => field.key === 'gender') && (
						<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<DefaultInput
									label="질문 텍스트"
									value={testData.pre_questions?.find((field) => field.key === 'gender')?.label || ''}
									onChange={(e) => onUpdateGenderField?.({ label: e.target.value })}
									placeholder="성별을 선택해주세요"
								/>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">선택지</label>
									<div className="space-y-2">
										{testData.pre_questions
											?.find((field) => field.key === 'gender')
											?.choices.map((choice, index) => (
												<div key={index} className="flex gap-2">
													<DefaultInput
														value={choice.value}
														onChange={(e) => {
															const newChoices = [
																...(testData.pre_questions?.find((field) => field.key === 'gender')?.choices || []),
															];
															newChoices[index] = { ...choice, value: e.target.value };
															onUpdateGenderField?.({ choices: newChoices });
														}}
														placeholder="값 (예: male)"
														className="flex-1"
													/>
													<DefaultInput
														value={choice.label}
														onChange={(e) => {
															const newChoices = [
																...(testData.pre_questions?.find((field) => field.key === 'gender')?.choices || []),
															];
															newChoices[index] = { ...choice, label: e.target.value };
															onUpdateGenderField?.({ choices: newChoices });
														}}
														placeholder="라벨 (예: 남자)"
														className="flex-1"
													/>
												</div>
											))}
									</div>
								</div>
							</div>

							<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<div className="text-sm font-medium text-blue-800 mb-2">💡 결과 변형 규칙 설정</div>
								<p className="text-sm text-blue-700">
									성별에 따라 결과 제목이 다르게 표시되도록 설정할 수 있습니다. 예: "에겐남", "에겐녀", "테토남",
									"테토녀" 등
								</p>
							</div>
						</div>
					)}
				</AdminCardContent>
			</AdminCard>

			{/* 발행 설정 */}
			<AdminCard variant="modal" padding="sm">
				<AdminCardHeader
					variant="modal"
					title={
						<div className="text-lg flex items-center gap-2">
							<span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
								📢
							</span>
							발행 설정
						</div>
					}
				/>
				<AdminCardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
						<div>
							<div className="text-base font-medium">즉시 공개</div>
							<p className="text-sm text-gray-600">테스트를 바로 공개할지 설정합니다</p>
						</div>
						<Switch
							checked={testData.status === 'published'}
							onCheckedChange={(checked) =>
								onUpdateTestData({
									...testData,
									status: checked ? 'published' : 'draft',
								})
							}
						/>
					</div>

					{testData.status === 'draft' && (
						<div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">예약 발행</label>
								<div className="flex gap-2">
									<DefaultInput
										label=""
										type="datetime-local"
										value={testData.scheduled_at || ''}
										onChange={(e) =>
											onUpdateTestData({
												...testData,
												scheduled_at: e.target.value,
											})
										}
										className="flex-1"
									/>
									<IconButton
										variant="outline"
										onClick={() => onUpdateTestData({ ...testData, scheduled_at: null })}
										icon={<X className="w-4 h-4" />}
										aria-label="예약 발행 취소"
										className="border-gray-300 hover:border-red-300 hover:bg-red-50"
									/>
								</div>
								<p className="text-sm text-gray-500">지정한 시간에 자동으로 공개됩니다</p>
							</div>
						</div>
					)}
				</AdminCardContent>
			</AdminCard>
		</div>
	);
};

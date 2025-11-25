import React, { useCallback, useMemo } from 'react';
import { DefaultInput, DefaultSelect, DefaultTextarea, IconButton, Switch, Button } from '@pickid/ui';
import { LoadingState } from '@/components/ui';
import { X, RefreshCw } from 'lucide-react';
import { useCategories } from '@/hooks';
import { ThumbnailUpload } from '../components';
import { useTestForm } from '@/providers/TestCreationFormProvider';
import { generateShortCode } from '@/utils/test.utils';

export const BasicInfoStep = () => {
	const { watch, setValue } = useTestForm();
	const testData = watch('basicInfo');
	const selectedType = watch('type');

	const { categories, loading } = useCategories();

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue('basicInfo', { ...testData, title: e.target.value });
	};

	const handleShortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue('basicInfo', { ...testData, short_code: e.target.value });
	};

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue('basicInfo', { ...testData, description: e.target.value || null });
	};

	const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue('basicInfo', { ...testData, intro_text: e.target.value || null });
	};

	const handleEstimatedTimeChange = (value: string) => {
		setValue('basicInfo', { ...testData, estimated_time: parseInt(value) });
	};

	const handleMaxScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue('basicInfo', { ...testData, max_score: parseInt(e.target.value) || 100 });
	};

	const handleRequiresGenderChange = (checked: boolean) => {
		setValue('basicInfo', { ...testData, requires_gender: checked });
	};

	const handlePublishToggle = (checked: boolean) => {
		setValue('basicInfo', { ...testData, status: checked ? 'published' : 'draft' });
	};

	const handleRegenerateShortCode = () => {
		setValue('basicInfo', { ...testData, short_code: generateShortCode() });
	};

	const categoryIdSet = useMemo(() => new Set(testData.category_ids), [testData.category_ids]);

	const handleCategoryToggle = (categoryId: string) => {
		const newIds = categoryIdSet.has(categoryId)
			? testData.category_ids.filter((id: string) => id !== categoryId)
			: [...testData.category_ids, categoryId];
		setValue('basicInfo', { ...testData, category_ids: newIds });
	};

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 왼쪽: 기본 정보 */}
				<div className="space-y-6">
					<DefaultInput
						label="테스트 제목"
						required
						value={testData.title}
						onChange={handleTitleChange}
						placeholder="예: 나는 어떤 MBTI 유형일까?"
					/>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">테스트 코드 (공유용)</label>
						<div className="flex gap-2">
							<DefaultInput
								value={testData.short_code}
								onChange={handleShortCodeChange}
								placeholder="예: ABC123"
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleRegenerateShortCode}
								className="px-3 py-2"
								title="새 코드 생성"
							>
								<RefreshCw className="w-4 h-4" />
							</Button>
						</div>
						<p className="text-sm text-gray-500 mt-1">테스트 공유 시 사용할 고유 코드입니다. (예: /t/ABC123)</p>
					</div>

					<DefaultTextarea
						label="테스트 설명"
						value={testData.description || ''}
						onChange={handleDescriptionChange}
						placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
						rows={3}
					/>

					<DefaultTextarea
						label="시작 문구"
						value={testData.intro_text || ''}
						onChange={handleIntroChange}
						placeholder="테스트 시작 전 사용자에게 보여줄 문구를 입력하세요"
						rows={3}
					/>

					<div className="grid grid-cols-2 gap-4">
						<DefaultSelect
							label="예상 소요 시간"
							value={testData.estimated_time?.toString()}
							onValueChange={handleEstimatedTimeChange}
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
								onChange={handleMaxScoreChange}
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
						onUpdateThumbnail={(url) => setValue('basicInfo', { ...testData, thumbnail_url: url })}
					/>

					<div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								카테고리 <span className="text-red-500">*</span>
							</label>
							{loading ? (
								<LoadingState message="카테고리를 불러오는 중..." size="sm" className="py-4" />
							) : (
								<div className="grid grid-cols-2 gap-2">
									{categories.map((category) => (
										<button
											key={category.id}
											onClick={() => handleCategoryToggle(category.id)}
											className={`p-3 border rounded-lg text-left transition-all ${
												categoryIdSet.has(category.id)
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

				{/* 성별 필드 설정 */}
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
						<div>
							<div className="text-base font-medium">성별 정보 수집</div>
						</div>
						<div className="flex items-center gap-2">
							<Switch checked={Boolean(testData.requires_gender)} onCheckedChange={handleRequiresGenderChange} />
						</div>
					</div>
				</div>

				{/* 발행 설정 */}
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
						<div className="text-base font-medium">즉시발행</div>
						<Switch
							checked={testData.status === 'published' || testData.status === undefined}
							onCheckedChange={handlePublishToggle}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

import React from 'react';
import { DefaultInput, DefaultTextarea, DefaultSelect, Button } from '@pickid/ui';
import { RefreshCw } from 'lucide-react';
import { generateSlug } from '@/utils/test.utils';
import type { BasicInfoFormProps } from '@/types/test-form';
import type { TestType } from '@pickid/supabase';

const TIME_OPTIONS = [
	{ value: '1', label: '1분 (초단편)' },
	{ value: '3', label: '3분 (빠른 테스트)' },
	{ value: '5', label: '5분 (표준)' },
	{ value: '10', label: '10분 (상세)' },
	{ value: '15', label: '15분 (심화)' },
];

export function BasicInfoForm({
	testData,
	selectedType,
	onUpdateTestData,
	onUpdateTitle,
	onRegenerateShortCode,
}: BasicInfoFormProps) {
	return (
		<div className="space-y-6">
			<div>
				<DefaultInput
					label="테스트 제목"
					required
					value={testData.title}
					onChange={(e) => {
						const newTitle = e.target.value;
						onUpdateTitle(newTitle);

						if (!testData.slug || testData.slug.trim() === '') {
							const newSlug = generateSlug(newTitle);
							onUpdateTestData({ ...testData, title: newTitle, slug: newSlug });
						} else {
							onUpdateTestData({ ...testData, title: newTitle });
						}
					}}
					placeholder="예: 나는 어떤 MBTI 유형일까?"
				/>
			</div>

			<div>
				<DefaultInput
					label="URL 슬러그"
					required
					value={testData.slug}
					onChange={(e) => onUpdateTestData({ ...testData, slug: e.target.value })}
					            placeholder="예: 인싸력-테스트"
					            helperText="URL에 사용될 고유한 식별자입니다. 한글, 영문, 숫자, 하이픈만 사용 가능합니다."
					        />				{testData.slug && <p className="text-sm text-gray-500 mt-1">URL: /tests/{testData.slug}</p>}
			</div>

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
				onChange={(e) => onUpdateTestData({ ...testData, description: e.target.value })}
				placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
				rows={3}
			/>

			<DefaultTextarea
				label="시작 문구"
				value={testData.intro_text || ''}
				onChange={(e) => onUpdateTestData({ ...testData, intro_text: e.target.value })}
				placeholder="테스트 시작 전 사용자에게 보여줄 문구를 입력하세요"
				rows={3}
			/>

			<div className="grid grid-cols-2 gap-4">
				<DefaultSelect
					label="예상 소요 시간"
					value={testData.estimated_time?.toString() || '5'}
					onValueChange={(value: string) => onUpdateTestData({ ...testData, estimated_time: parseInt(value) })}
					options={TIME_OPTIONS}
					placeholder="소요 시간을 선택하세요"
				/>

				<DefaultSelect
					label="테스트 상태"
					value={testData.status || 'published'}
					onValueChange={(value: string) =>
						onUpdateTestData({
							...testData,
							status: value as 'draft' | 'published',
						})
					}
					options={[
						{ value: 'published', label: '공개' },
						{ value: 'draft', label: '초안' },
					]}
					placeholder="상태를 선택하세요"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{selectedType === 'psychology' && (
					<DefaultInput
						label="최대 점수"
						type="number"
						value={testData.max_score || 100}
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

				<DefaultSelect
					label="테스트 유형"
					value={testData.type || 'psychology'}
					onValueChange={(value: string) => onUpdateTestData({ ...testData, type: value as TestType })}
					options={[
						{ value: 'psychology', label: '심리 테스트' },
						{ value: 'balance', label: '밸런스 게임' },
						{ value: 'character', label: '캐릭터 테스트' },
						{ value: 'quiz', label: '퀴즈' },
						{ value: 'meme', label: '밈 테스트' },
						{ value: 'lifestyle', label: '라이프스타일' },
					]}
					placeholder="유형을 선택하세요"
				/>
			</div>
		</div>
	);
}

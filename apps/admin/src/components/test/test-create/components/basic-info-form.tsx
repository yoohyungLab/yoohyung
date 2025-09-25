import React from 'react';
import { DefaultInput, DefaultTextarea, DefaultSelect } from '@repo/ui';
import { BasicInfoFormProps } from '../types';

const TIME_OPTIONS = [
	{ value: '1', label: '1분 (초단편)' },
	{ value: '3', label: '3분 (빠른 테스트)' },
	{ value: '5', label: '5분 (표준)' },
	{ value: '10', label: '10분 (상세)' },
	{ value: '15', label: '15분 (심화)' },
];

export function BasicInfoForm({ testData, selectedType, onUpdateTestData, onUpdateTitle }: BasicInfoFormProps) {
	return (
		<div className="space-y-6">
			<div>
				<DefaultInput
					label="테스트 제목"
					required
					value={testData.title}
					onChange={(e) => onUpdateTitle(e.target.value)}
					placeholder="예: 나는 어떤 MBTI 유형일까?"
				/>
				{testData.slug && <p className="text-sm text-gray-500 mt-1">URL: /tests/{testData.slug}</p>}
			</div>

			<DefaultTextarea
				label="테스트 설명"
				value={testData.description}
				onChange={(e) => onUpdateTestData({ ...testData, description: e.target.value })}
				placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
				rows={3}
			/>

			<DefaultTextarea
				label="시작 문구"
				value={testData.intro_text}
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
					value={testData.status || 'draft'}
					onValueChange={(value: string) =>
						onUpdateTestData({
							...testData,
							status: value as 'draft' | 'published',
						})
					}
					options={[
						{ value: 'draft', label: '초안' },
						{ value: 'published', label: '공개' },
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
					onValueChange={(value: string) => onUpdateTestData({ ...testData, type: value })}
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

import React from 'react';
import { Badge } from '@repo/ui';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import { Target, Heart, Clock, AlertCircle, Check } from 'lucide-react';
import { testTypes } from '@/constants/testData';
import type { BasicInfo } from '../types';
// ResultData 타입 정의 (useTestCreation과 일치)
interface ResultData {
	result_name: string;
	result_order: number;
	description: string | null;
	match_conditions: { type: 'score'; min: number; max: number };
	background_image_url: string | null;
	theme_color: string;
	features: Record<string, unknown>;
}

interface QuestionData {
	question_text: string;
	question_order: number;
	image_url: string | null;
	choices: {
		choice_text: string;
		choice_order: number;
		score: number;
		is_correct: boolean;
	}[];
}

interface PreviewStepProps {
	testData: BasicInfo;
	questions: QuestionData[];
	results: ResultData[];
	selectedType: string;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ testData, questions, results, selectedType }) => {
	const getTypeConfig = () => testTypes.find((t) => t.id === selectedType);

	const checklistItems = [
		{ check: testData.title?.trim(), text: '테스트 제목이 입력되었나요?' },
		{
			check: testData.category_ids?.length > 0,
			text: '카테고리가 선택되었나요?',
		},
		{ check: questions.length >= 3, text: '질문이 3개 이상 작성되었나요?' },
		{ check: results.length >= 2, text: '결과가 2개 이상 설정되었나요?' },
		{
			check: questions.every((q: QuestionData) => q.choices?.length >= 2),
			text: '모든 질문에 선택지가 2개 이상인가요?',
		},
		{
			check: results.every((r: ResultData) => (r.description?.length || 0) > 20),
			text: '모든 결과에 충분한 내용이 있나요?',
		},
	];

	const allChecksPassed = checklistItems.every((item) => item.check);

	return (
		<div className="space-y-6">
			{/* 테스트 정보 */}
			<AdminCard variant="gradient" padding="sm">
				<AdminCardHeader
					variant="modal"
					title={
						<div className="text-lg flex items-center gap-2">
							<Target className="w-5 h-5 text-blue-600" />
							테스트 정보
						</div>
					}
				/>
				<AdminCardContent>
					<div className="space-y-2">
						<h2 className="text-2xl text-blue-900 font-bold">{testData.title || '제목 없음'}</h2>
						<p className="text-blue-700">{testData.description || '설명 없음'}</p>
						{testData.intro_text && <p className="text-blue-600 text-sm">{testData.intro_text}</p>}

						<div className="flex flex-wrap gap-2 mt-4">
							<Badge variant="outline" className="bg-white">
								{getTypeConfig()?.name || '알 수 없음'}
							</Badge>
							<Badge variant="outline" className="bg-white">
								<Clock className="w-3 h-3 mr-1" />
								{testData.estimated_time || 5}분
							</Badge>
							<Badge variant={testData.status === 'published' ? 'default' : 'secondary'}>
								{testData.status === 'published' ? '공개' : '비공개'}
							</Badge>
						</div>
					</div>
				</AdminCardContent>
			</AdminCard>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 질문 요약 */}
				<AdminCard variant="modal" padding="sm">
					<AdminCardHeader
						variant="modal"
						title={
							<div className="text-lg flex items-center gap-2">
								<Target className="w-5 h-5 text-blue-600" />
								질문 ({questions.length}개)
							</div>
						}
					/>
					<AdminCardContent>
						<div className="space-y-3">
							{questions.slice(0, 3).map((question: QuestionData, index: number) => (
								<div key={index} className="p-3 bg-gray-50 rounded-lg">
									<div className="flex items-start gap-3">
										<div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
											{index + 1}
										</div>
										<div className="flex-1">
											<p className="font-medium text-gray-900">{question.question_text || '질문 없음'}</p>
											<p className="text-sm text-gray-500 mt-1">{question.choices?.length || 0}개 선택지</p>
										</div>
									</div>
								</div>
							))}
							{questions.length > 3 && (
								<p className="text-center text-gray-500 text-sm">... 외 {questions.length - 3}개 질문</p>
							)}
						</div>
					</AdminCardContent>
				</AdminCard>

				{/* 결과 요약 */}
				<AdminCard variant="modal" padding="sm">
					<AdminCardHeader
						variant="modal"
						title={
							<div className="text-lg flex items-center gap-2">
								<Heart className="w-5 h-5 text-green-600" />
								결과 ({results.length}개)
							</div>
						}
					/>
					<AdminCardContent>
						<div className="space-y-3">
							{results.map((result: ResultData, index: number) => (
								<div key={index} className="p-3 bg-gray-50 rounded-lg">
									<div className="flex items-start gap-3">
										<div
											className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
											style={{
												backgroundColor: result.theme_color || '#3B82F6',
											}}
										/>
										<div className="flex-1">
											<p className="font-medium text-gray-900">{result.result_name || '결과 없음'}</p>
											<p className="text-sm text-gray-600 mt-1">
												{result.description?.substring(0, 60) || '설명 없음'}...
											</p>
											{selectedType === 'psychology' && result.match_conditions && (
												<p className="text-xs text-gray-500 mt-1">
													{result.match_conditions.min}-{result.match_conditions.max}점
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</AdminCardContent>
				</AdminCard>
			</div>

			{/* 체크리스트 */}
			<AdminCard
				variant="modal"
				padding="sm"
				className={`border-2 ${allChecksPassed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}
			>
				<AdminCardHeader
					variant="modal"
					title={
						<div className={`text-lg flex items-center gap-2 ${allChecksPassed ? 'text-green-800' : 'text-amber-800'}`}>
							<AlertCircle className="w-5 h-5" />
							발행 전 체크리스트
							{allChecksPassed && <span className="text-sm font-normal">✅ 모든 항목 완료!</span>}
						</div>
					}
				/>
				<AdminCardContent>
					<div className="space-y-2">
						{checklistItems.map((item, index) => (
							<div key={index} className="flex items-center gap-3">
								<div
									className={`w-5 h-5 rounded-full flex items-center justify-center ${
										item.check ? 'bg-green-500 text-white' : 'bg-gray-300'
									}`}
								>
									{item.check && <Check className="w-3 h-3" />}
								</div>
								<span className={item.check ? 'text-green-800' : 'text-gray-600'}>{item.text}</span>
							</div>
						))}
					</div>
				</AdminCardContent>
			</AdminCard>
		</div>
	);
};

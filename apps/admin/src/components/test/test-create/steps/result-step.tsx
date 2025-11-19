import React, { useState } from 'react';
import { Button, DefaultInput, DefaultTextarea, Label, Badge, DefaultSelect } from '@pickid/ui';
import { Plus, Trash2, X } from 'lucide-react';
import { TEST_TYPES } from '@/constants/test.constants';
import { ImageUpload } from '../components/image-upload';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import type { ResultStepProps, FeatureInput, ResultData } from '@/types/test.types';

// 상수

const GENDER_OPTIONS = [
	{ value: 'all', label: '전체 (성별 무관)' },
	{ value: 'male', label: '남성' },
	{ value: 'female', label: '여성' },
];

const DEFAULT_THEME_COLOR = '#3B82F6';

// 유틸리티 함수

const parseValues = (value: string): string[] => {
	if (!value.trim()) return [];
	return value
		.split(',')
		.map((v) => v.trim())
		.filter((v) => v.length > 0);
};

const getGenderBadgeClass = (gender: string) => {
	switch (gender) {
		case 'male':
			return 'bg-blue-50 text-blue-700';
		case 'female':
			return 'bg-pink-50 text-pink-700';
		default:
			return 'bg-gray-50 text-gray-700';
	}
};

const getGenderLabel = (gender: string) => {
	switch (gender) {
		case 'male':
			return '👨 남성';
		case 'female':
			return '👩 여성';
		default:
			return '👥 전체';
	}
};

// 컴포넌트

export const ResultStep: React.FC<ResultStepProps> = (props) => {
	const { results, selectedType, onAddResult, onRemoveResult, onUpdateResult } = props;
	const [featureInputs, setFeatureInputs] = useState<Record<number, FeatureInput>>({});

	const typeConfig = TEST_TYPES.find((t) => t.id === selectedType);

	// 기능 관리 함수들

	const updateFeatureInput = (resultIndex: number, field: 'key' | 'value', value: string) => {
		setFeatureInputs((prev) => ({
			...prev,
			[resultIndex]: { ...prev[resultIndex], [field]: value },
		}));
	};

	const addFeature = (resultIndex: number) => {
		const input = featureInputs[resultIndex];
		if (!input?.key?.trim() || !input?.value?.trim()) return;

		const currentFeatures = (results[resultIndex]?.features || {}) as Record<string, unknown>;
		const values = parseValues(input.value);

		onUpdateResult(resultIndex, {
			features: { ...currentFeatures, [input.key]: values } as unknown as ResultData['features'],
		});

		setFeatureInputs((prev) => ({
			...prev,
			[resultIndex]: { key: '', value: '' },
		}));
	};

	const removeFeature = (resultIndex: number, featureKey: string) => {
		const currentFeatures = (results[resultIndex]?.features || {}) as Record<string, unknown>;
		const newFeatures = { ...currentFeatures };
		delete newFeatures[featureKey];
		onUpdateResult(resultIndex, { features: newFeatures as unknown as ResultData['features'] });
	};

	const updateFeatureValue = (resultIndex: number, featureKey: string, newValue: string) => {
		const currentFeatures = (results[resultIndex]?.features || {}) as Record<string, unknown>;
		onUpdateResult(resultIndex, {
			features: { ...currentFeatures, [featureKey]: newValue } as unknown as ResultData['features'],
		});
	};

	const removeFeatureValue = (resultIndex: number, featureKey: string, valueToRemove: string) => {
		const currentFeatures = (results[resultIndex]?.features || {}) as Record<string, unknown>;
		const currentValue = currentFeatures[featureKey];

		if (Array.isArray(currentValue)) {
			const newValues = currentValue.filter((v) => v !== valueToRemove);
			onUpdateResult(resultIndex, {
				features: { ...currentFeatures, [featureKey]: newValues } as unknown as ResultData['features'],
			});
		} else if (typeof currentValue === 'string') {
			const values = parseValues(currentValue);
			const newValues = values.filter((v) => v !== valueToRemove);
			onUpdateResult(resultIndex, {
				features: { ...currentFeatures, [featureKey]: newValues.join(', ') } as unknown as ResultData['features'],
			});
		}
	};

	// 렌더링 함수들

	const renderScoreRange = (result: ResultData, resultIndex: number) => {
		if (selectedType !== 'psychology') return null;
		const conditions = result.match_conditions as {
			type?: string;
			min?: number;
			max?: number;
			codes?: string[];
		};
		const matchingType = conditions?.type || 'score';

		return (
			<div className="space-y-4">
				{/* 매칭 방식 선택 */}
				<div>
					<Label className="text-base font-medium mb-2">매칭 방식</Label>
					<DefaultSelect
						value={matchingType}
						onValueChange={(value) => {
							if (value === 'code') {
								onUpdateResult(resultIndex, {
									match_conditions: { type: 'code', codes: [] },
								});
							} else {
								onUpdateResult(resultIndex, {
									match_conditions: { type: 'score', min: 0, max: 10 },
								});
							}
						}}
						options={[
							{ value: 'score', label: '📊 점수형 (점수 범위로 매칭)' },
							{ value: 'code', label: '🎭 코드형 (성향 코드로 매칭)' },
						]}
					/>
				</div>

				{/* 점수형 입력 */}
				{matchingType === 'score' ? (
					<div>
						<Label className="text-sm font-medium">점수 구간</Label>
						<div className="grid grid-cols-2 gap-2 mt-2">
							<DefaultInput
								type="number"
								value={conditions?.min || 0}
								onChange={(e) =>
									onUpdateResult(resultIndex, {
										match_conditions: {
											type: 'score',
											...conditions,
											min: parseInt(e.target.value) || 0,
										},
									})
								}
								placeholder="최소점수"
							/>
							<DefaultInput
								type="number"
								value={conditions?.max || 10}
								onChange={(e) =>
									onUpdateResult(resultIndex, {
										match_conditions: {
											type: 'score',
											...conditions,
											max: parseInt(e.target.value) || 10,
										},
									})
								}
								placeholder="최대점수"
							/>
						</div>
					</div>
				) : (
					/* 코드형 입력 */
					<div>
						<Label className="text-sm font-medium mb-2">매칭 코드</Label>
						<DefaultInput
							value={(conditions?.codes || []).join(', ')}
							onChange={(e) => {
								const codes = e.target.value
									.split(',')
									.map((c) => c.trim().toUpperCase())
									.filter((c) => c.length > 0);
								onUpdateResult(resultIndex, {
									match_conditions: { type: 'code', codes },
								});
							}}
							placeholder="H, H+P, E+S (쉼표로 구분)"
						/>
						<p className="text-xs text-gray-500 mt-1">이 결과에 매칭될 코드를 입력하세요. 예: H (단일), H+P (조합)</p>
					</div>
				)}

				{/* 성별 타겟 */}
				<div className="mt-3">
					<Label className="text-sm font-medium text-gray-700">성별 타겟</Label>
					<DefaultSelect
						value={result.target_gender || 'all'}
						onValueChange={(value) =>
							onUpdateResult(resultIndex, {
								target_gender: value === 'all' ? null : value,
							})
						}
						className="mt-1"
						options={GENDER_OPTIONS}
					/>
					<p className="text-xs text-gray-500 mt-1">전체: 모든 성별에게 표시, 남성/여성: 해당 성별에게만 표시</p>
				</div>
			</div>
		);
	};

	const renderScoreBadge = (result: ResultData) => {
		if (selectedType !== 'psychology') return null;
		const conditions = result.match_conditions as {
			type?: string;
			min?: number;
			max?: number;
			codes?: string[];
		};
		const gender = result.target_gender;
		const matchingType = conditions?.type || 'score';

		return (
			<div className="flex items-center gap-2">
				{matchingType === 'code' ? (
					<Badge variant="outline" className="bg-purple-50 text-purple-700">
						🎭 {(conditions?.codes || []).join(', ') || '미설정'}
					</Badge>
				) : (
					<Badge variant="outline" className="bg-blue-50">
						📊 {conditions?.min || 0}-{conditions?.max || 10}점
					</Badge>
				)}
				{gender && (
					<Badge variant="outline" className={getGenderBadgeClass(gender)}>
						{getGenderLabel(gender)}
					</Badge>
				)}
			</div>
		);
	};

	const renderFeature = (resultIndex: number, featureKey: string, values: string | string[]) => {
		const valueArray = Array.isArray(values) ? values : parseValues(values as string);
		const displayValue = Array.isArray(values) ? values.join(', ') : values;

		return (
			<div key={featureKey} className="border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between mb-2">
					<Label className="text-sm font-medium text-gray-700">{featureKey}</Label>
					<Button
						onClick={() => removeFeature(resultIndex, featureKey)}
						variant="outline"
						size="sm"
						className="text-red-600 hover:text-red-700"
					>
						<X className="w-3 h-3" />
					</Button>
				</div>

				<div className="space-y-2">
					<DefaultInput
						value={displayValue}
						onChange={(e) => updateFeatureValue(resultIndex, featureKey, e.target.value)}
						placeholder="값을 콤마로 구분하여 입력하세요"
						className="font-mono"
					/>

					<div className="flex flex-wrap gap-1">
						{valueArray.map((value, index) => (
							<Badge key={index} variant="secondary" className="flex items-center gap-1">
								{value}
								<button
									onClick={() => removeFeatureValue(resultIndex, featureKey, value)}
									className="ml-1 hover:text-red-500"
								>
									<X className="w-3 h-3" />
								</button>
							</Badge>
						))}
					</div>
				</div>
			</div>
		);
	};

	const renderFeatureInput = (resultIndex: number) => {
		const input = featureInputs[resultIndex] || { key: '', value: '' };
		const isDisabled = !input.key?.trim() || !input.value?.trim();

		return (
			<div className="border border-dashed border-gray-300 rounded-lg p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<DefaultInput
						placeholder="특징명 (예: 추천 직업)"
						value={input.key}
						onChange={(e) => updateFeatureInput(resultIndex, 'key', e.target.value)}
					/>
					<DefaultInput
						placeholder="값들 (콤마로 구분)"
						value={input.value}
						onChange={(e) => updateFeatureInput(resultIndex, 'value', e.target.value)}
					/>
					<Button
						onClick={() => addFeature(resultIndex)}
						disabled={isDisabled}
						className="bg-blue-600 hover:bg-blue-700"
					>
						<Plus className="w-4 h-4 mr-1" />
						특징 추가
					</Button>
				</div>
			</div>
		);
	};

	// 메인 렌더링

	// 밸런스 게임 타입일 때는 특별한 안내 메시지 표시
	if (selectedType === 'balance') {
		return (
			<div className="space-y-6">
				<div className="text-center py-12">
					<div className="text-6xl mb-4">⚖️</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-4">밸런스 게임 결과</h3>
					<p className="text-lg text-gray-600 mb-6">밸런스 게임은 별도의 결과 설정이 필요하지 않습니다.</p>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
						<h4 className="font-semibold text-blue-900 mb-3">밸런스 게임 결과 화면 구성</h4>
						<div className="text-left space-y-3 text-sm text-blue-800">
							<div className="flex items-start gap-2">
								<span className="text-blue-600">🧭</span>
								<span>
									<strong>당신의 선택 여정:</strong> A vs B 중 어떤 쪽을 더 자주 골랐는지 비율 시각화
								</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-blue-600">👀</span>
								<span>
									<strong>다른 사람들과 비교:</strong> 소수파 vs 다수파 체감형 비교
								</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-blue-600">📊</span>
								<span>
									<strong>주제별 전체 통계:</strong> 최다 선택 문항, 가장 팽팽했던 문항 등
								</span>
							</div>
						</div>
					</div>
					<p className="text-sm text-gray-500 mt-6">
						사용자가 테스트를 완료하면 자동으로 선택 패턴 분석 결과가 표시됩니다.
					</p>
				</div>
			</div>
		);
	}

	// 퀴즈 타입일 때 안내 메시지 및 템플릿 제공
	if (selectedType === 'quiz') {
		const hasResults = results && results.length > 0;

		return (
			<div className="space-y-6">
				{!hasResults ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🎯</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-4">퀴즈형 결과 설정</h3>
						<p className="text-lg text-gray-600 mb-4">점수 구간별로 다른 메시지를 표시할 수 있습니다.</p>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-6">
							<p className="text-sm text-blue-900">
								<strong>💡 채점 방식:</strong> 각 문제는 동일한 배점입니다.
								<br />
								예: 10문제 중 8개 정답 = 80점 (정답률 80%)
							</p>
						</div>

						<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 max-w-2xl mx-auto mb-6">
							<h4 className="font-semibold text-indigo-900 mb-3">점수 구간별 결과 예시</h4>
							<div className="text-left space-y-2 text-sm text-indigo-800">
								<div>
									🏆 <strong>95-100점 (S등급):</strong> "완벽합니다! 당신은 이 분야의 전문가예요!"
								</div>
								<div>
									🥇 <strong>85-94점 (A등급):</strong> "우수해요! 거의 완벽한 점수입니다!"
								</div>
								<div>
									🥈 <strong>70-84점 (B등급):</strong> "잘했어요! 조금만 더 노력하면 완벽!"
								</div>
								<div>
									🥉 <strong>50-69점 (C등급):</strong> "괜찮아요! 다시 도전해보세요!"
								</div>
								<div>
									📝 <strong>0-49점 (D등급):</strong> "조금 더 공부가 필요해요!"
								</div>
							</div>
						</div>
						<Button
							onClick={() => {
								// 기본 5개 등급 템플릿 추가
								const defaultResults = [
									{
										result_name: 'S등급 - 완벽!',
										result_order: 0,
										description: '완벽합니다! 당신은 이 분야의 전문가예요! 모든 문제를 정확하게 이해하고 있습니다.',
										match_conditions: { type: 'score' as const, min: 95, max: 100 },
										background_image_url: null,
										theme_color: '#FFD700',
										features: {},
										target_gender: null,
									},
									{
										result_name: 'A등급 - 우수',
										result_order: 1,
										description: '우수해요! 거의 완벽한 점수입니다. 조금만 더 집중하면 만점도 가능해요!',
										match_conditions: { type: 'score' as const, min: 85, max: 94 },
										background_image_url: null,
										theme_color: '#3B82F6',
										features: {},
										target_gender: null,
									},
									{
										result_name: 'B등급 - 양호',
										result_order: 2,
										description: '잘했어요! 기본적인 내용은 모두 이해하고 있습니다. 조금만 더 노력하면 완벽!',
										match_conditions: { type: 'score' as const, min: 70, max: 84 },
										background_image_url: null,
										theme_color: '#10B981',
										features: {},
										target_gender: null,
									},
									{
										result_name: 'C등급 - 보통',
										result_order: 3,
										description: '괜찮아요! 아직 개선의 여지가 있습니다. 다시 한번 도전해보세요!',
										match_conditions: { type: 'score' as const, min: 50, max: 69 },
										background_image_url: null,
										theme_color: '#F59E0B',
										features: {},
										target_gender: null,
									},
									{
										result_name: 'D등급 - 노력 필요',
										result_order: 4,
										description:
											'조금 더 공부가 필요해요. 포기하지 말고 다시 도전해보세요! 연습하면 분명 나아질 거예요.',
										match_conditions: { type: 'score' as const, min: 0, max: 49 },
										background_image_url: null,
										theme_color: '#6B7280',
										features: {},
										target_gender: null,
									},
								];

								defaultResults.forEach((result, index) => {
									onAddResult();
									// 결과 추가 후 즉시 기본값으로 업데이트
									onUpdateResult(index, result);
								});
							}}
							className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-base"
						>
							<Plus className="w-5 h-5 mr-2" />
							기본 템플릿으로 시작하기 (5개 등급)
						</Button>
						<p className="text-sm text-gray-500 mt-4">또는 직접 결과를 추가하여 커스터마이징할 수 있습니다.</p>
						<Button onClick={onAddResult} variant="outline" className="mt-3">
							<Plus className="w-4 h-4 mr-2" />
							직접 결과 추가하기
						</Button>
					</div>
				) : (
					// 결과가 있을 때는 일반 결과 편집 UI 표시
					<>
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-semibold text-gray-900">퀴즈 결과 설정</h3>
								<p className="text-gray-600 mt-1">점수 구간별로 다른 메시지를 설정하세요</p>
							</div>
							<Button onClick={onAddResult} className="bg-green-600 hover:bg-green-700">
								<Plus className="w-4 h-4 mr-2" />
								결과 추가
							</Button>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
							<p className="text-sm text-blue-900">
								<strong>📊 채점 방식:</strong> 정답 개수로 자동 계산됩니다.
								<br />
								• 10문제 중 8개 정답 = 80점
								<br />
								• 5문제 중 5개 정답 = 100점
								<br />각 문제는 동일한 배점(1점)으로 계산되며, 100점 만점으로 환산됩니다.
							</p>
						</div>

						<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
							<p className="text-sm text-indigo-800">
								<strong>💡 팁:</strong> 점수 구간이 겹치지 않도록 설정하세요. 사용자의 점수에 맞는 첫 번째 결과가
								표시됩니다.
							</p>
						</div>

						<div className="grid gap-6">
							{results.map((result, resultIndex) => {
								if (!result) return null;
								const conditions = result.match_conditions;

								return (
									<AdminCard key={resultIndex} variant="bordered" padding="sm">
										<AdminCardHeader
											variant="modal"
											title={
												<div className="text-lg flex items-center gap-2">
													<span className="w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-bold">
														{resultIndex + 1}
													</span>
													결과 {resultIndex + 1}
													<Badge variant="outline" className="bg-indigo-50">
														{conditions?.min || 0}-{conditions?.max || 100}점
													</Badge>
												</div>
											}
											action={
												results.length > 1 && (
													<Button
														onClick={() => onRemoveResult(resultIndex)}
														variant="outline"
														size="sm"
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												)
											}
										/>
										<AdminCardContent className="space-y-6">
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
												<div className="space-y-4">
													<DefaultInput
														label="결과 제목 (등급명)"
														required
														value={result.result_name || ''}
														onChange={(e) =>
															onUpdateResult(resultIndex, {
																result_name: e.target.value,
															})
														}
														placeholder="예: S등급 - 완벽!"
													/>

													<div>
														<Label className="text-base font-medium mb-2">점수 구간</Label>
														<div className="grid grid-cols-2 gap-2">
															<DefaultInput
																type="number"
																label="최소 점수"
																value={conditions?.min || 0}
																onChange={(e) =>
																	onUpdateResult(resultIndex, {
																		match_conditions: {
																			type: 'score',
																			...conditions,
																			min: parseInt(e.target.value) || 0,
																		},
																	})
																}
																min="0"
																max="100"
															/>
															<DefaultInput
																type="number"
																label="최대 점수"
																value={conditions?.max || 100}
																onChange={(e) =>
																	onUpdateResult(resultIndex, {
																		match_conditions: {
																			type: 'score',
																			...conditions,
																			max: parseInt(e.target.value) || 100,
																		},
																	})
																}
																min="0"
																max="100"
															/>
														</div>
														<p className="text-xs text-gray-500 mt-1">이 점수 범위에 해당하는 사용자에게 표시됩니다</p>
													</div>

													<div>
														<Label className="text-base font-medium">테마 색상</Label>
														<div className="flex gap-2 mt-2">
															<input
																type="color"
																value={result.theme_color || '#3B82F6'}
																onChange={(e) =>
																	onUpdateResult(resultIndex, {
																		theme_color: e.target.value,
																	})
																}
																className="w-16 h-10 border border-gray-300 rounded"
															/>
															<DefaultInput
																value={result.theme_color || ''}
																onChange={(e) =>
																	onUpdateResult(resultIndex, {
																		theme_color: e.target.value,
																	})
																}
																placeholder="#3B82F6"
															/>
														</div>
													</div>
												</div>

												<div>
													<DefaultTextarea
														label="결과 메시지"
														required
														value={result.description || ''}
														onChange={(e) =>
															onUpdateResult(resultIndex, {
																description: e.target.value,
															})
														}
														placeholder="이 점수를 받은 사용자에게 표시할 메시지를 입력하세요"
														rows={10}
													/>
												</div>
											</div>
										</AdminCardContent>
									</AdminCard>
								);
							})}
						</div>
					</>
				)}
			</div>
		);
	}

	if (!results || results.length === 0) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold text-gray-900">결과 설정</h3>
						<p className="text-gray-600 mt-1">{typeConfig?.name} 테스트 결과를 정의하세요</p>
					</div>
					<Button onClick={onAddResult} className="bg-green-600 hover:bg-green-700">
						<Plus className="w-4 h-4 mr-2" />
						결과 추가
					</Button>
				</div>
				<div className="text-center py-8 text-gray-500">아직 결과가 없습니다. 결과를 추가해주세요.</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-xl font-semibold text-gray-900">결과 설정</h3>
					<p className="text-gray-600 mt-1">{typeConfig?.name} 테스트 결과를 정의하세요</p>
				</div>
				<Button onClick={onAddResult} className="bg-green-600 hover:bg-green-700">
					<Plus className="w-4 h-4 mr-2" />
					결과 추가
				</Button>
			</div>

			<div className="grid gap-6">
				{results.map((result, resultIndex) => {
					if (!result) return null;

					return (
						<AdminCard key={resultIndex} variant="bordered" padding="sm">
							<AdminCardHeader
								variant="modal"
								title={
									<div className="text-lg flex items-center gap-2">
										<span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
											{resultIndex + 1}
										</span>
										결과 {resultIndex + 1}
										{renderScoreBadge(result)}
									</div>
								}
								action={
									results.length > 1 && (
										<Button
											onClick={() => onRemoveResult(resultIndex)}
											variant="outline"
											size="sm"
											className="text-red-600 hover:text-red-700"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									)
								}
							/>
							<AdminCardContent className="space-y-6">
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									<div className="space-y-4">
										<DefaultInput
											label="결과 제목"
											required
											value={result.result_name || ''}
											onChange={(e) =>
												onUpdateResult(resultIndex, {
													result_name: e.target.value,
												})
											}
											placeholder="예: 외향적인 리더형"
										/>

										{renderScoreRange(result, resultIndex)}

										<div>
											<Label className="text-base font-medium">테마 색상</Label>
											<div className="flex gap-2 mt-2">
												<input
													type="color"
													value={result.theme_color || DEFAULT_THEME_COLOR}
													onChange={(e) =>
														onUpdateResult(resultIndex, {
															theme_color: e.target.value,
														})
													}
													className="w-16 h-10 border border-gray-300 rounded"
												/>
												<DefaultInput
													value={result.theme_color || ''}
													onChange={(e) =>
														onUpdateResult(resultIndex, {
															theme_color: e.target.value,
														})
													}
													placeholder={DEFAULT_THEME_COLOR}
												/>
											</div>
										</div>
									</div>

									<div>
										<DefaultTextarea
											label="결과 설명"
											required
											value={result.description || ''}
											onChange={(e) =>
												onUpdateResult(resultIndex, {
													description: e.target.value,
												})
											}
											placeholder="결과에 대한 자세한 설명을 입력하세요"
											rows={8}
										/>
									</div>

									<div>
										<ImageUpload
											imageUrl={result.background_image_url || ''}
											onUpdateImage={(url) =>
												onUpdateResult(resultIndex, {
													background_image_url: url,
												})
											}
											label="결과 이미지"
											desc="결과 화면에 표시될 배경 이미지입니다"
										/>
									</div>
								</div>

								<div className="border-t pt-6">
									<div className="flex items-center justify-between mb-4">
										<Label className="text-lg font-medium">특징</Label>
										<div className="text-sm text-gray-500">콤마로 구분하여 여러 값을 입력하세요</div>
									</div>

									<div className="space-y-4 mb-6">
										{Object.entries(result.features || {}).map(([featureKey, values]) =>
											renderFeature(resultIndex, featureKey, values as string | string[])
										)}
									</div>

									{renderFeatureInput(resultIndex)}
								</div>
							</AdminCardContent>
						</AdminCard>
					);
				})}
			</div>
		</div>
	);
};

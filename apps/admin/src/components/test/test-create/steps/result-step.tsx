import React, { useState } from 'react';
import { Button, DefaultInput, DefaultTextarea, Label, Badge } from '@repo/ui';
import { Plus, Trash2, X } from 'lucide-react';
import { testTypes } from '@/constants/testData';
import { ImageUpload } from '../components/image-upload';
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
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';

interface ResultStepProps {
	results: ResultData[];
	selectedType: string;
	onAddResult: () => void;
	onRemoveResult: (resultIndex: number) => void;
	onUpdateResult: (resultIndex: number, updates: Partial<ResultData>) => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
	results,
	selectedType,
	onAddResult,
	onRemoveResult,
	onUpdateResult,
}) => {
	const [featureInputs, setFeatureInputs] = useState<Record<number, { key: string; value: string }>>({});

	const typeConfig = testTypes.find((t) => t.id === selectedType);

	const updateFeatureInput = (resultIndex: number, field: 'key' | 'value', value: string) => {
		setFeatureInputs((prev) => ({
			...prev,
			[resultIndex]: { ...prev[resultIndex], [field]: value },
		}));
	};

	const parseValues = (value: string) => {
		if (!value.trim()) return [];
		return value
			.split(',')
			.map((v) => v.trim())
			.filter((v) => v.length > 0);
	};

	const addFeature = (resultIndex: number) => {
		const input = featureInputs[resultIndex];
		if (!input?.key?.trim() || !input?.value?.trim()) return;

		const currentFeatures = results[resultIndex]?.features || {};
		const values = parseValues(input.value);

		onUpdateResult(resultIndex, {
			features: { ...currentFeatures, [input.key]: values },
		});

		setFeatureInputs((prev) => ({
			...prev,
			[resultIndex]: { key: '', value: '' },
		}));
	};

	const removeFeature = (resultIndex: number, featureKey: string) => {
		const currentFeatures = results[resultIndex]?.features || {};
		const newFeatures = { ...currentFeatures };
		delete newFeatures[featureKey];
		onUpdateResult(resultIndex, { features: newFeatures });
	};

	const updateFeatureValue = (resultIndex: number, featureKey: string, newValue: string) => {
		const currentFeatures = results[resultIndex]?.features || {};
		// 입력값을 그대로 저장하고, 파싱은 필요할 때만 수행
		onUpdateResult(resultIndex, {
			features: { ...currentFeatures, [featureKey]: newValue },
		});
	};

	const removeFeatureValue = (resultIndex: number, featureKey: string, valueToRemove: string) => {
		const currentFeatures = results[resultIndex]?.features || {};
		const currentValue = currentFeatures[featureKey];

		if (Array.isArray(currentValue)) {
			// 배열인 경우 해당 값을 제거
			const newValues = currentValue.filter((v) => v !== valueToRemove);
			onUpdateResult(resultIndex, {
				features: {
					...currentFeatures,
					[featureKey]: newValues,
				},
			});
		} else if (typeof currentValue === 'string') {
			// 문자열인 경우 해당 값을 제거하고 다시 문자열로 변환
			const values = parseValues(currentValue);
			const newValues = values.filter((v) => v !== valueToRemove);
			onUpdateResult(resultIndex, {
				features: {
					...currentFeatures,
					[featureKey]: newValues.join(', '),
				},
			});
		}
	};

	const renderScoreRange = (result: ResultData, resultIndex: number) => {
		if (selectedType !== 'psychology') return null;
		const conditions = result.match_conditions;

		return (
			<div>
				<Label className="text-base font-medium">점수 구간</Label>
				<div className="grid grid-cols-2 gap-2 mt-2">
					<DefaultInput
						type="number"
						value={conditions?.min || 0}
						onChange={(e) =>
							onUpdateResult(resultIndex, {
								match_conditions: {
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
									...conditions,
									max: parseInt(e.target.value) || 10,
								},
							})
						}
						placeholder="최대점수"
					/>
				</div>
			</div>
		);
	};

	const renderScoreBadge = (result: ResultData) => {
		if (selectedType !== 'psychology') return null;
		const conditions = result.match_conditions;
		return (
			<Badge variant="outline" className="bg-blue-50">
				{conditions?.min || 0}-{conditions?.max || 10}점
			</Badge>
		);
	};

	const renderFeature = (resultIndex: number, featureKey: string, values: string | string[]) => {
		// values가 문자열인 경우 배열로 변환, 배열인 경우 그대로 사용
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

	// results가 비어있거나 유효하지 않은 경우 처리
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
					// result가 undefined이거나 유효하지 않은 경우 건너뛰기
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

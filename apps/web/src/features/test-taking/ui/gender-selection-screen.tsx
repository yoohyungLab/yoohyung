'use client';

import { useState } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../themes';

// 성별 필드 타입 정의
interface GenderField {
	key: string;
	label: string;
	type: string;
	required: boolean;
	choices: Array<{ value: string; label: string }>;
}

interface GenderSelectionScreenProps {
	test: TestWithNestedDetails;
	onGenderSelected: (gender: string) => void;
	theme: ColorTheme;
}

export function GenderSelectionScreen({ test, onGenderSelected, theme }: GenderSelectionScreenProps) {
	const [selectedGender, setSelectedGender] = useState<string>('');

	// 테스트의 pre_questions에서 성별 필드 찾기 (필수인 경우만)
	const preQuestions = (test?.test as { pre_questions?: GenderField[] })?.pre_questions;
	const genderField = preQuestions?.find((field) => field.key === 'gender' && field.required);

	if (!genderField) {
		// 성별 필드가 없거나 필수가 아니면 바로 다음 단계로
		onGenderSelected('');
		return null;
	}

	const handleGenderSelect = (gender: string) => {
		setSelectedGender(gender);
	};

	const handleNext = () => {
		if (selectedGender) {
			onGenderSelected(selectedGender);
		}
	};

	return (
		<main className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
				{/* 배경 장식 */}
				<div className={`absolute top-0 right-0 w-32 h-32 bg-${theme.accent}-300 rounded-full blur-3xl opacity-30`} />
				<div
					className={`absolute bottom-0 left-0 w-32 h-32 bg-${theme.primary}-300 rounded-full blur-3xl opacity-30`}
				/>

				{/* 제목 */}
				<header className="text-center mb-8">
					<h1 className="text-2xl font-black mb-4 text-gray-800 leading-tight">{genderField.label}</h1>
					<p className="text-sm text-gray-600 leading-relaxed">더 정확한 결과를 위해 성별을 선택해주세요</p>
				</header>

				{/* 성별 선택 옵션 */}
				<section className="space-y-3 mb-8">
					{genderField.choices.map((choice) => (
						<button
							key={choice.value}
							onClick={() => handleGenderSelect(choice.value)}
							className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
								selectedGender === choice.value
									? `border-${theme.primary}-500 bg-${theme.primary}-50 text-${theme.primary}-700`
									: 'border-gray-200 hover:border-gray-300 text-gray-700'
							}`}
						>
							<div className="flex items-center justify-center gap-3">
								<div
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
										selectedGender === choice.value
											? `border-${theme.primary}-500 bg-${theme.primary}-500`
											: 'border-gray-300'
									}`}
								>
									{selectedGender === choice.value && <div className="w-2 h-2 bg-white rounded-full" />}
								</div>
								<span className="text-lg font-semibold">{choice.label}</span>
							</div>
						</button>
					))}
				</section>

				{/* 다음 버튼 */}
				<button
					onClick={handleNext}
					disabled={!selectedGender}
					className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black py-5 rounded-2xl hover:bg-right transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-98 text-lg animate-gradient disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					다음
				</button>
			</article>
		</main>
	);
}

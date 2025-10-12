import Image from 'next/image';
import { useCountAnimation } from '@/shared/hooks';
import { useTestStartVM } from '../model/useTestStartVM';
import { StartButton } from './start-button';
import { GenderSelectModal } from './gender-select-modal';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../lib/themes';

interface ITestIntroProps {
	test: TestWithNestedDetails;
	onStart: (selectedGender?: 'male' | 'female') => void;
	theme: ColorTheme;
}

export function TestIntro({ test, onStart, theme }: ITestIntroProps) {
	// TypeScript 캐시 이슈로 타입 단언 사용
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const startCount = (test?.test as any)?.start_count || 0;
	const { count: animatedCount, isAnimating } = useCountAnimation(startCount, 800);

	const { showGenderModal, handleStartTest, handleGenderSelect } = useTestStartVM({
		testId: test?.test?.id,
		testTitle: test?.test?.title,
		requiresGender: test?.test?.requires_gender,
	});

	const handleStart = () => {
		handleStartTest(onStart);
	};

	const handleGenderChoice = (gender: 'male' | 'female') => {
		handleGenderSelect(gender, onStart);
	};

	return (
		<div className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-visible">
				{/* 배경 장식 */}
				<div className={`absolute top-0 right-0 w-32 h-32 bg-${theme.accent}-300 rounded-full blur-3xl opacity-30`} />
				<div
					className={`absolute bottom-0 left-0 w-32 h-32 bg-${theme.primary}-300 rounded-full blur-3xl opacity-30`}
				/>

				{/* 썸네일 */}
				{test?.test?.thumbnail_url && (
					<figure className="relative w-full aspect-square mb-6 rounded-3xl overflow-hidden shadow-xl">
						<Image
							src={test.test.thumbnail_url}
							alt={test.test.title || '테스트'}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 420px"
							priority={true}
						/>
					</figure>
				)}

				{/* 제목과 설명 */}
				<header className="text-center mb-6">
					<h1 className="text-2xl font-black mb-4 text-gray-800 leading-tight">{test?.test?.title || '테스트'}</h1>
					{test?.test?.description && (
						<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{test.test.description}</p>
					)}
				</header>

				{/* 참여자 수 표시 */}
				<section
					className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-5 mb-6 text-center relative overflow-hidden`}
				>
					<div className="flex items-baseline justify-center gap-2 mb-1">
						<span className="text-xs font-bold text-gray-600">지금까지</span>
						<span
							className={`text-3xl font-black ${
								theme.name === 'purple'
									? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
									: theme.name === 'blue'
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
									: theme.name === 'green'
									? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
									: theme.name === 'orange'
									? 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
									: 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'
							} ${isAnimating ? 'animate-pulse' : ''}`}
						>
							{animatedCount.toLocaleString()}
						</span>
						<span className="text-xs font-bold text-gray-600">명</span>
					</div>
					<p className="text-xs font-bold text-gray-500">참여 중이에요!</p>
				</section>

				{/* 시작 버튼 */}
				<StartButton onClick={handleStart} theme={theme} />

				{/* 성별 선택 모달 */}
				{showGenderModal && <GenderSelectModal onSelect={handleGenderChoice} />}
			</article>
		</div>
	);
}

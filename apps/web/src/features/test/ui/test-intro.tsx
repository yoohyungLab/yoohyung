import { useCountAnimation } from '@/shared/hooks';
import { ImageWithFallback } from '@/shared/ui/image-with-fallback';
import { Button } from '@pickid/ui';
import { useTestStartVM } from '../model/useTestStartVM';
import { GenderSelectModal } from './gender-select-modal';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../lib/themes';

interface TestIntroProps {
	test: TestWithNestedDetails;
	onStart: (selectedGender?: 'male' | 'female') => void;
	theme: ColorTheme;
}

export function TestIntro(props: TestIntroProps) {
	const { test, onStart, theme } = props;

	// TypeScript 캐시 이슈로 타입 단언 사용
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const startCount = (test?.test as any)?.start_count || 0;
	const { count: animatedCount, isAnimating } = useCountAnimation(startCount, 800);

	const { showGenderModal, handleStartTest, handleGenderSelect } = useTestStartVM({
		testId: test?.test?.id,
		testTitle: test?.test?.title,
		requiresGender: test?.test?.requires_gender,
	});

	// 디버깅 로그
	console.log('TestIntro Debug:', {
		testId: test?.test?.id,
		requiresGender: test?.test?.requires_gender,
		showGenderModal,
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

				{/* 썸네일 - 썸네일이 있을 때만 표시 */}
				{test?.test?.thumbnail_url && (
					<figure className="relative w-full aspect-square mb-6 rounded-3xl overflow-hidden shadow-xl">
						<ImageWithFallback
							src={test.test.thumbnail_url}
							alt={test?.test?.title || '테스트'}
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
				<Button
					onClick={handleStart}
					size="xl"
					className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black rounded-2xl hover:bg-right hover:animate-gradient transition-all duration-500 shadow-xl hover:shadow-2xl `}
					style={{
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
					}}
				>
					시작하기
				</Button>

				{/* 성별 선택 모달 */}
				{showGenderModal && <GenderSelectModal onSelect={handleGenderChoice} />}
			</article>
		</div>
	);
}

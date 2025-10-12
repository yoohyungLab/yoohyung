import Image from 'next/image';
import { useState, useRef } from 'react';
import { useCountAnimation } from '@/shared/hooks';
import { trackTestStart } from '@/shared/lib/analytics';
import { User, UserRound } from 'lucide-react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../themes';

interface TestStartScreenProps {
	test: TestWithNestedDetails;
	onStart: (selectedGender?: 'male' | 'female') => void;
	theme: ColorTheme;
}

export function TestStartScreen({ test, onStart, theme }: TestStartScreenProps) {
	// TypeScript 캐시 이슈로 타입 단언 사용 (start_count는 database.ts에 존재함)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const startCount = (test?.test as any)?.start_count || 0;
	const { count: animatedCount, isAnimating } = useCountAnimation(startCount, 800);

	// 성별 필드가 활성화되어 있는지 확인
	const hasGenderField = test?.test?.requires_gender;

	// 성별 선택 모달 상태
	const [showGenderModal, setShowGenderModal] = useState(false);

	// 중복 호출 방지
	const isIncrementingRef = useRef(false);

	// 시작 버튼 클릭 핸들러
	const handleStart = async () => {
		// 중복 호출 방지
		if (isIncrementingRef.current) return;
		isIncrementingRef.current = true;

		// 시작 횟수 증가
		try {
			const { supabase } = await import('@pickid/supabase');
			await supabase.rpc('increment_test_start', { test_uuid: test?.test?.id });
		} catch (err) {
			console.warn('Failed to increment start count:', err);
		}

		// GA 이벤트 추적
		if (test?.test?.id && test?.test?.title) {
			trackTestStart(test.test.id, test.test.title);
		}

		if (hasGenderField) {
			setShowGenderModal(true);
		} else {
			onStart();
		}
	};

	// 성별 선택 핸들러
	const handleGenderSelect = (gender: 'male' | 'female') => {
		setShowGenderModal(false);
		onStart(gender);
	};

	return (
		<main className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient} relative`}>
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
						<pre className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
							{test.test.description}
						</pre>
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
				<button
					onClick={handleStart}
					className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black py-5 rounded-2xl hover:bg-right transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-98 text-lg animate-gradient`}
				>
					시작하기
				</button>

				{/* 성별 선택 모달 - 테스트 카드 영역 내부에만 표시 */}
				{showGenderModal && (
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-[2.5rem] z-50 flex items-center justify-center p-4 animate-fadeIn">
						<div className="bg-white rounded-3xl p-8 w-full max-w-xs shadow-2xl animate-slideUp relative">
							<div className="text-center mb-8">
								<h3 className="text-xl font-bold text-gray-900">성별 선택</h3>
							</div>

							<div className="flex gap-3">
								<button
									onClick={() => handleGenderSelect('male')}
									className="flex-1 group relative overflow-hidden py-6 px-6 rounded-2xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg active:scale-95"
								>
									<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" />
									<div className="relative flex flex-col items-center gap-2">
										<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
											<User className="w-6 h-6 text-blue-600" />
										</div>
										<span className="font-bold text-gray-900">남성</span>
									</div>
								</button>

								<button
									onClick={() => handleGenderSelect('female')}
									className="flex-1 group relative overflow-hidden py-6 px-6 rounded-2xl border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg active:scale-95"
								>
									<div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
									<div className="relative flex flex-col items-center gap-2">
										<div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
											<UserRound className="w-6 h-6 text-pink-600" />
										</div>
										<span className="font-bold text-gray-900">여성</span>
									</div>
								</button>
							</div>
						</div>
					</div>
				)}
			</article>
		</main>
	);
}

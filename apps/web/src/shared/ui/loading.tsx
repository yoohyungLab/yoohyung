'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, FileText, CheckCircle, Sparkles, TrendingUp, Users, Zap, Heart } from 'lucide-react';

interface ILoadingProps {
	variant?: 'default' | 'test' | 'result';
	message?: string;
	description?: string;
}

export function Loading({ variant = 'default', message, description }: ILoadingProps) {
	const [progress, setProgress] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const [dots, setDots] = useState('');

	const defaultMessages = {
		default: { message: '로딩 중', description: '' },
		test: { message: '테스트 준비 중', description: '잠시만 기다려주세요 ...' },
		result: { message: '결과를 분석하고 있어요', description: '' },
	};

	const finalMessage = message || defaultMessages[variant].message;
	const finalDescription = description || defaultMessages[variant].description;

	// NOTE: 사이즈 옵션은 UI 규격 통일로 제거되었습니다.

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	const analysisSteps = useMemo(
		() => [
			{ icon: FileText, text: '당신의 답변을 모으고 있어요', delay: 0 },
			{ icon: TrendingUp, text: '결과를 계산하고 있어요', delay: 800 },
			{ icon: Users, text: '다른 사람들과 비교 중이에요', delay: 1600 },
		],
		[]
	);

	useEffect(() => {
		if (variant === 'result') {
			// 최소 로딩 시간: 3200ms (마지막 단계까지 완료)
			const MIN_LOADING_TIME = 3200;
			const PROGRESS_INTERVAL = MIN_LOADING_TIME / 100; // 32ms

			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) {
						clearInterval(progressInterval);
						return 100;
					}
					return prev + 1;
				});
			}, PROGRESS_INTERVAL);

			const stepTimers = analysisSteps.map((step, index) =>
				setTimeout(() => {
					setCurrentStep(index);
				}, step.delay)
			);

			return () => {
				clearInterval(progressInterval);
				stepTimers.forEach(clearTimeout);
			};
		}
	}, [variant, analysisSteps]);

	if (variant === 'result') {
		return (
			<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
				<div className="w-full max-w-[420px]">
					<div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-rose-300 rounded-full blur-3xl opacity-20" />
						<div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-300 rounded-full blur-3xl opacity-20" />

						<div className="relative flex justify-center mb-8">
							<div className="relative">
								<div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
									<div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-200 to-amber-200 opacity-50" />
								</div>

								<div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
									<Sparkles className="w-12 h-12 text-white animate-pulse" />
								</div>

								<div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<FileText className="w-4 h-4 text-rose-500" />
									</div>
								</div>
								<div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '0.3s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<TrendingUp className="w-4 h-4 text-pink-500" />
									</div>
								</div>
								<div className="absolute -top-2 -left-2 animate-bounce" style={{ animationDelay: '0.6s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<Users className="w-4 h-4 text-amber-500" />
									</div>
								</div>
							</div>
						</div>

						<h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{finalMessage}</h1>

						<div className="mb-6">
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-pink-500 to-amber-500 transition-all duration-300 ease-out rounded-full"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className="text-xs text-gray-500 text-center mt-2">{progress}%</p>
						</div>

						<div className="space-y-3">
							{analysisSteps.map((step, index) => {
								const Icon = step.icon;
								const isActive = index === currentStep;
								const isCompleted = index < currentStep;

								return (
									<div
										key={index}
										className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
											isActive
												? 'bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200'
												: isCompleted
												? 'bg-gray-50 border border-gray-200'
												: 'bg-white border border-gray-100 opacity-40'
										}`}
									>
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
												isActive
													? 'bg-gradient-to-r from-pink-500 to-amber-500 animate-pulse'
													: isCompleted
													? 'bg-gray-400'
													: 'bg-gray-200'
											}`}
										>
											{isCompleted ? (
												<CheckCircle className="w-5 h-5 text-white" />
											) : (
												<Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
											)}
										</div>
										<span
											className={`text-sm font-medium transition-colors ${
												isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
											}`}
										>
											{step.text}
										</span>
										{isActive && (
											<div className="ml-auto">
												<Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
											</div>
										)}
									</div>
								);
							})}
						</div>

						{finalDescription && <p className="text-sm text-gray-600 text-center mt-6">{finalDescription}</p>}
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
			<div className="w-full max-w-[420px]">
				<div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-20 animate-pulse" />
					<div
						className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-20 animate-pulse"
						style={{ animationDelay: '1s' }}
					/>

					<div className="relative flex justify-center mb-6">
						<div className="relative">
							<div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
								<div className="w-20 h-20 rounded-full border-4 border-transparent border-t-amber-300 border-r-pink-300" />
							</div>

							<div className="relative w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
								<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
									{variant === 'test' ? (
										<Zap className="w-8 h-8 text-white" />
									) : (
										<Heart className="w-8 h-8 text-white" />
									)}
								</div>
							</div>

							<div className="absolute -top-1 right-2 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
							<div
								className="absolute -bottom-1 left-2 w-3 h-3 bg-amber-400 rounded-full animate-ping"
								style={{ animationDelay: '0.5s' }}
							/>
						</div>
					</div>

					<div className="text-center space-y-2 relative">
						<h1 className="text-2xl font-bold text-gray-900">
							{finalMessage}
							<span className="inline-block w-8 text-left">{dots}</span>
						</h1>
						{finalDescription && <p className="text-sm text-gray-600 animate-pulse">{finalDescription}</p>}
					</div>

					<div className="flex justify-center gap-2 mt-6">
						<div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" />
						<div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
						<div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
					</div>
				</div>

				<p className="text-xs text-gray-500 text-center mt-4 animate-pulse"></p>
			</div>
		</main>
	);
}

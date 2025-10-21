'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, FileText, CheckCircle, Sparkles, TrendingUp, Users, Zap, Heart } from 'lucide-react';

interface LoadingProps {
	variant?: 'default' | 'test' | 'result';
	message?: string;
	description?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function Loading({ variant = 'default', message, description, size = 'md' }: LoadingProps) {
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

	const sizeConfig = {
		sm: { spinner: 'w-8 h-8', text: 'text-lg', description: 'text-sm' },
		md: { spinner: 'w-12 h-12', text: 'text-2xl', description: 'text-base' },
		lg: { spinner: 'w-16 h-16', text: 'text-3xl', description: 'text-lg' },
	};

	// 점 애니메이션
	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	// 결과 분석 단계
	const analysisSteps = useMemo(
		() => [
			{ icon: FileText, text: '답변 수집 중', delay: 0 },
			{ icon: TrendingUp, text: '통계 분석 중', delay: 800 },
			{ icon: Users, text: '비교 데이터 계산 중', delay: 1600 },
			{ icon: Sparkles, text: '결과 생성 중', delay: 2400 },
		],
		[]
	);

	useEffect(() => {
		if (variant === 'result') {
			// 프로그레스 바 애니메이션
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) {
						clearInterval(progressInterval);
						return 100;
					}
					return prev + 2;
				});
			}, 30);

			// 단계별 전환
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

	// 결과 로딩 - 특별한 애니메이션
	if (variant === 'result') {
		return (
			<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
				<div className="w-full max-w-[420px]">
					{/* 메인 카드 */}
					<div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
						{/* 배경 장식 */}
						<div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-20" />
						<div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-20" />

						{/* 중앙 아이콘 */}
						<div className="relative flex justify-center mb-8">
							<div className="relative">
								{/* 회전하는 배경 원 */}
								<div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
									<div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-50" />
								</div>

								{/* 메인 원 */}
								<div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
									<Sparkles className="w-12 h-12 text-white animate-pulse" />
								</div>

								{/* 주변 떠다니는 아이콘들 */}
								<div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<FileText className="w-4 h-4 text-purple-500" />
									</div>
								</div>
								<div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '0.3s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<TrendingUp className="w-4 h-4 text-pink-500" />
									</div>
								</div>
								<div className="absolute -top-2 -left-2 animate-bounce" style={{ animationDelay: '0.6s' }}>
									<div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
										<Users className="w-4 h-4 text-indigo-500" />
									</div>
								</div>
							</div>
						</div>

						{/* 제목 */}
						<h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{finalMessage}</h1>

						{/* 프로그레스 바 */}
						<div className="mb-6">
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out rounded-full"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className="text-xs text-gray-500 text-center mt-2">{progress}%</p>
						</div>

						{/* 분석 단계 */}
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
												? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
												: isCompleted
												? 'bg-gray-50 border border-gray-200'
												: 'bg-white border border-gray-100 opacity-40'
										}`}
									>
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
												isActive
													? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse'
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
												<Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
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

	// 기본/테스트 로딩 - 화려하게 업그레이드
	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
			<div className="w-full max-w-[420px]">
				{/* 카드 */}
				<div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
					{/* 배경 장식 */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
					<div
						className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse"
						style={{ animationDelay: '1s' }}
					/>

					{/* 중앙 아이콘 영역 */}
					<div className="relative flex justify-center mb-6">
						<div className="relative">
							{/* 회전하는 외부 링 */}
							<div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
								<div className="w-20 h-20 rounded-full border-4 border-transparent border-t-purple-300 border-r-pink-300" />
							</div>

							{/* 중앙 원 */}
							<div className="relative w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
								<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
									{variant === 'test' ? (
										<Zap className="w-8 h-8 text-white" />
									) : (
										<Heart className="w-8 h-8 text-white" />
									)}
								</div>
							</div>

							{/* 떠다니는 작은 원들 */}
							<div className="absolute -top-1 right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
							<div
								className="absolute -bottom-1 left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping"
								style={{ animationDelay: '0.5s' }}
							/>
						</div>
					</div>

					{/* 텍스트 */}
					<div className="text-center space-y-2 relative">
						<h1 className="text-2xl font-bold text-gray-900">
							{finalMessage}
							<span className="inline-block w-8 text-left">{dots}</span>
						</h1>
						{finalDescription && <p className="text-sm text-gray-600 animate-pulse">{finalDescription}</p>}
					</div>

					{/* 도트 인디케이터 */}
					<div className="flex justify-center gap-2 mt-6">
						<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
						<div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
						<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
					</div>
				</div>

				{/* 하단 힌트 */}
				<p className="text-xs text-gray-500 text-center mt-4 animate-pulse"></p>
			</div>
		</main>
	);
}

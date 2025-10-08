'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { BalanceOption } from '@/shared/types/home';

const BALANCE_OPTIONS: BalanceOption[] = [
	{ id: 'A', emoji: '🍜', label: '라면', percentage: 52 },
	{ id: 'B', emoji: '🍕', label: '피자', percentage: 48 },
];

const TOTAL_VOTES = 1234;

export default function BalanceGameSection() {
	const [selectedBalance, setSelectedBalance] = useState<'A' | 'B' | null>(null);
	const [showResult, setShowResult] = useState(false);

	const handleVote = useCallback((id: 'A' | 'B') => {
		setSelectedBalance(id);
		setShowResult(true);
	}, []);

	const handleReset = useCallback(() => {
		setShowResult(false);
		setSelectedBalance(null);
	}, []);

	const selectedOption = BALANCE_OPTIONS.find((opt) => opt.id === selectedBalance);

	return (
		<section className="py-8">
			<h2 className="text-xl font-bold text-gray-900 mb-5">오늘의 밸런스</h2>
			<div className="bg-white rounded-lg border border-gray-200 p-5">
				<p className="text-sm font-bold text-gray-900 mb-4">평생 라면만 먹기 vs 평생 피자만 먹기</p>

				{!showResult ? (
					<>
						<div className="grid grid-cols-2 gap-3">
							{BALANCE_OPTIONS.map(({ id, emoji, label }) => (
								<button
									key={id}
									onClick={() => handleVote(id)}
									className="rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition-all"
								>
									<div className="text-2xl mb-2">{emoji}</div>
									<div className="text-sm font-bold text-gray-900">{label}</div>
								</button>
							))}
						</div>
						<p className="text-xs text-gray-500 text-center mt-4">선택하고 결과를 확인하세요</p>
					</>
				) : (
					<div className="space-y-4">
						{/* 투표 결과 */}
						<div className="space-y-2">
							{BALANCE_OPTIONS.map(({ id, emoji, label, percentage }) => {
								const isSelected = selectedBalance === id;
								return (
									<div key={id} className="relative">
										<div className="flex items-center justify-between mb-1">
											<div className="flex items-center gap-2">
												<span className="text-lg">{emoji}</span>
												<span className="text-sm font-semibold text-gray-900">{label}</span>
												{isSelected && (
													<span className="text-xs font-bold text-white bg-gray-900 px-2 py-0.5 rounded">내 선택</span>
												)}
											</div>
											<span className="text-sm font-bold text-gray-900">{percentage}%</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all duration-500 ${isSelected ? 'bg-gray-900' : 'bg-gray-400'}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>

						{/* 통계 정보 */}
						<div className="bg-gray-50 rounded-lg p-3 text-center">
							<div className="text-xs text-gray-600">
								<span className="font-semibold">{TOTAL_VOTES.toLocaleString()}명</span>이 참여했어요
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{selectedOption &&
									`${Math.round(
										(TOTAL_VOTES * selectedOption.percentage) / 100
									).toLocaleString()}명이 같은 선택을 했어요`}
							</div>
						</div>

						{/* TODO: 굳이 공유를 해야할지? */}
						{/* 공유 & 다시하기 */}
						<div className="grid grid-cols-2 gap-2">
							<button className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">
								결과 공유하기
							</button>
							<button
								onClick={handleReset}
								className="px-4 py-2 bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
							>
								다시 참여하기
							</button>
						</div>
					</div>
				)}

				<Link href="/balance-game" className="block text-center text-xs text-gray-600 hover:text-gray-900 mt-4">
					더 많은 밸런스 게임 →
				</Link>
			</div>
		</section>
	);
}

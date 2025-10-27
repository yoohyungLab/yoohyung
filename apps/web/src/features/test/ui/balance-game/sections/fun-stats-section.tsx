'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pickid/ui';
import { Flame, Scale } from 'lucide-react';
import type { IControversialChoice, IOverwhelmingChoice } from '@/shared/types';

interface IFunStatsSectionProps {
	controversialChoice: IControversialChoice | null;
	overwhelmingChoice: IOverwhelmingChoice | null;
}

export const FunStatsSection = memo(function FunStatsSection({
	controversialChoice,
	overwhelmingChoice,
}: IFunStatsSectionProps) {
	return (
		<div className="space-y-6">
			{/* 가장 팽팽했던 대결 - 보라/핑크 톤 */}
			{controversialChoice && (
				<Card
					className="relative overflow-hidden"
					style={{
						border: '1px solid rgba(0, 0, 0, 0.06)',
						boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.5)',
					}}
				>
					<CardHeader className="pb-4">
						<div className="flex items-start gap-3">
							<Scale className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
							<div className="flex-1">
								<CardTitle className="text-[17px] mb-1">가장 팽팽했던 대결</CardTitle>
								<CardDescription className="text-[14px]">이 문항은 의견이 극단적으로 갈렸어요</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{/* 질문 - 보라/핑크 그라데이션 */}
						<div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
							<h3 className="text-base font-bold text-gray-900">{controversialChoice.questionText}</h3>
						</div>
						<div className="space-y-3">
							{/* A 선택지 - 보라 톤 */}
							<div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
											<span className="text-white text-xs font-bold">A</span>
										</div>
										<span className="text-sm font-semibold text-gray-900">{controversialChoice.choiceA.text}</span>
									</div>
									<span className="text-sm font-bold text-gray-900">{controversialChoice.choiceA.percentage}%</span>
								</div>
								<div className="h-2 bg-purple-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-1000"
										style={{ width: `${controversialChoice.choiceA.percentage}%` }}
									/>
								</div>
								<p className="text-xs text-gray-600 mt-2">{controversialChoice.choiceA.count.toLocaleString()}명</p>
							</div>
							{/* B 선택지 - 핑크 톤 */}
							<div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
											<span className="text-white text-xs font-bold">B</span>
										</div>
										<span className="text-sm font-semibold text-gray-900">{controversialChoice.choiceB.text}</span>
									</div>
									<span className="text-sm font-bold text-gray-900">{controversialChoice.choiceB.percentage}%</span>
								</div>
								<div className="h-2 bg-pink-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-1000"
										style={{ width: `${controversialChoice.choiceB.percentage}%` }}
									/>
								</div>
								<p className="text-xs text-gray-600 mt-2">{controversialChoice.choiceB.count.toLocaleString()}명</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* 압도적인 선택 - 오렌지/회색 톤 */}
			{overwhelmingChoice && (
				<Card
					className="relative overflow-hidden"
					style={{
						border: '1px solid rgba(0, 0, 0, 0.06)',
						boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.5)',
					}}
				>
					<CardHeader className="pb-4">
						<div className="flex items-start gap-3">
							<Flame className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
							<div className="flex-1">
								<CardTitle className="text-[17px] mb-1">압도적인 선택</CardTitle>
								<CardDescription className="text-[14px]">이 문항은 모두가 한쪽을 골랐어요</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{/* 질문 - 오렌지 그라데이션 */}
						<div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
							<h3 className="text-base font-bold text-gray-900">{overwhelmingChoice.questionText}</h3>
						</div>
						<div className="space-y-3">
							{/* 승리 선택지 - 오렌지 강조 */}
							<div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
											<span className="text-white text-xs font-bold">A</span>
										</div>
										<span className="text-sm font-semibold text-gray-900">{overwhelmingChoice.winningChoice.text}</span>
									</div>
									<span className="text-sm font-bold text-orange-600">
										{overwhelmingChoice.winningChoice.percentage}%
									</span>
								</div>
								<div className="h-2 bg-orange-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-1000"
										style={{ width: `${overwhelmingChoice.winningChoice.percentage}%` }}
									/>
								</div>
								<p className="text-xs text-gray-600 mt-2">
									{overwhelmingChoice.winningChoice.count.toLocaleString()}명
								</p>
							</div>
							{/* 패배 선택지 - 회색 톤다운 */}
							<div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
											<span className="text-white text-xs font-bold">B</span>
										</div>
										<span className="text-sm font-semibold text-gray-600">{overwhelmingChoice.losingChoice.text}</span>
									</div>
									<span className="text-sm font-bold text-gray-600">{overwhelmingChoice.losingChoice.percentage}%</span>
								</div>
								<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
									<div
										className="h-full bg-gray-400 transition-all duration-1000"
										style={{ width: `${overwhelmingChoice.losingChoice.percentage}%` }}
									/>
								</div>
								<p className="text-xs text-gray-500 mt-2">{overwhelmingChoice.losingChoice.count.toLocaleString()}명</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
});

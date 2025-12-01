'use client';

import { FEEDBACK_CATEGORIES } from '@/constants/feedback';

interface FeedbackCategorySelectorProps {
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	error?: string;
}

export function FeedbackCategorySelector({ selectedCategory, onCategoryChange, error }: FeedbackCategorySelectorProps) {
	return (
		<div className="space-y-2">
			<label className="text-sm font-semibold text-gray-900">
				카테고리 <span className="text-red-500">*</span>
			</label>
			<div className="grid grid-cols-2 gap-2">
				{Object.entries(FEEDBACK_CATEGORIES).map(([key, config]) => {
					const isSelected = selectedCategory === key;

					return (
						<button
							key={key}
							type="button"
							onClick={() => onCategoryChange(key)}
							className={`
								text-left p-3 border rounded-lg transition-all
								${isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
								${error ? 'border-red-300' : ''}
							`}
						>
							<div className="flex items-start gap-2">
								<span className="text-lg flex-shrink-0">{config.EMOJI}</span>
								<div className="flex-1 min-w-0">
									<div className="text-xs font-bold text-gray-900 mb-0.5">{config.LABEL}</div>
									<div className="text-[10px] text-gray-500 line-clamp-1">{config.DESCRIPTION}</div>
								</div>
								{isSelected && (
									<div className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
										<svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</div>
						</button>
					);
				})}
			</div>
			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}

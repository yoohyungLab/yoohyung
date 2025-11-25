'use client';

import { FEEDBACK_CATEGORIES } from '@/constants';

interface FeedbackCategorySelectorProps {
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	error?: string;
}

export function FeedbackCategorySelector({ selectedCategory, onCategoryChange, error }: FeedbackCategorySelectorProps) {
	return (
		<div className="space-y-3">
			<label className="text-sm font-semibold text-gray-900">
				카테고리 <span className="text-red-500">*</span>
			</label>
			<div className="grid grid-cols-2 gap-2">
				{FEEDBACK_CATEGORIES.map((category) => (
					<label
						key={category.name}
						className={`
							flex items-center p-3 border rounded-lg cursor-pointer transition-all
							${
								selectedCategory === category.name
									? 'border-gray-900 bg-gray-50'
									: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
							}
							${error ? 'border-red-400 bg-red-50' : ''}
						`}
					>
						<input
							type="radio"
							name="category"
							value={category.name}
							checked={selectedCategory === category.name}
							onChange={(e) => onCategoryChange(e.target.value)}
							className="sr-only"
						/>
						<div className="flex items-center gap-3 w-full">
							<div className="text-xl">{category.emoji}</div>
							<div className="flex-1 min-w-0">
								<div className="text-xs font-bold text-gray-900">{category.label}</div>
								<div className="text-[10px] text-gray-500 line-clamp-1">{category.description}</div>
							</div>
							{selectedCategory === category.name && (
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
					</label>
				))}
			</div>
			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}

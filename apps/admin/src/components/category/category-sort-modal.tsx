import React, { useState, useEffect } from 'react';
import { categoryService } from '@/shared/api/services/category.service';
import type { Category } from '@repo/supabase';
import { Button } from '@repo/ui';
import { ArrowUpDown, X, GripVertical } from 'lucide-react';

interface CategorySortModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	categories: Category[];
}

export function CategorySortModal({ isOpen, onClose, onSuccess, categories }: CategorySortModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sortedCategories, setSortedCategories] = useState<Category[]>([]);

	useEffect(() => {
		if (isOpen) {
			// 현재 sort_order로 정렬된 카테고리 목록
			setSortedCategories([...categories].sort((a, b) => a.sort_order - b.sort_order));
		}
	}, [isOpen, categories]);

	const handleClose = () => {
		if (!loading) {
			setSortedCategories([]);
			setError(null);
			onClose();
		}
	};

	const moveCategory = (fromIndex: number, toIndex: number) => {
		const newCategories = [...sortedCategories];
		const [movedCategory] = newCategories.splice(fromIndex, 1);
		newCategories.splice(toIndex, 0, movedCategory);
		setSortedCategories(newCategories);
	};

	const handleSave = async () => {
		setLoading(true);
		setError(null);

		try {
			// 새로운 순서로 sort_order 업데이트
			const updates = sortedCategories.map((category, index) => ({
				id: category.id,
				sort_order: index,
			}));

			// 병렬로 모든 카테고리 순서 업데이트
			await Promise.all(updates.map(({ id, sort_order }) => categoryService.updateCategory(id, { sort_order })));

			onSuccess();
			onClose();
		} catch (error) {
			console.error('순서 변경 실패:', error);
			setError(error instanceof Error ? error.message : '순서 변경에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<ArrowUpDown className="h-5 w-5" />
						카테고리 순서 변경
					</h2>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0" disabled={loading}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Content */}
				<div className="p-6">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
							{error}
						</div>
					)}

					<div className="mb-4 text-sm text-gray-600">드래그하여 순서를 변경하세요. 위에 있을수록 먼저 표시됩니다.</div>

					{/* 카테고리 목록 */}
					<div className="space-y-2 max-h-[400px] overflow-y-auto">
						{sortedCategories.map((category, index) => (
							<div
								key={category.id}
								className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
							>
								<GripVertical className="h-4 w-4 text-gray-400 cursor-move" />

								<div className="flex-1">
									<div className="font-medium text-gray-900">{category.name}</div>
									{category.description && <div className="text-sm text-gray-500 truncate">{category.description}</div>}
								</div>

								<div className="flex items-center gap-2">
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">순서: {index}</span>

									{/* 위/아래 이동 버튼 */}
									<div className="flex flex-col gap-1">
										<Button
											variant="outline"
											size="sm"
											onClick={() => moveCategory(index, Math.max(0, index - 1))}
											disabled={index === 0 || loading}
											className="h-6 w-6 p-0"
										>
											↑
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => moveCategory(index, Math.min(sortedCategories.length - 1, index + 1))}
											disabled={index === sortedCategories.length - 1 || loading}
											className="h-6 w-6 p-0"
										>
											↓
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* 버튼 */}
					<div className="flex justify-end space-x-2 pt-4 mt-6 border-t border-gray-200">
						<Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
							취소
						</Button>
						<Button onClick={handleSave} loading={loading} loadingText="저장 중...">
							순서 저장
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import { categoryService } from '../../shared/api/services/category.service';
import { type Category } from '@repo/supabase';
import { Button, DefaultInput, DefaultTextarea } from '@repo/ui';
import { Plus, X, Pencil } from 'lucide-react';

interface CategoryCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	editCategory?: Category | null;
}

export function CategoryCreateModal({ isOpen, onClose, onSuccess, editCategory }: CategoryCreateModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		sort_order: 0,
		is_active: true,
	});

	const handleChange = (field: string, value: string | number | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (error) setError(null);
	};

	const resetForm = () => {
		setFormData({ name: '', description: '', sort_order: 0, is_active: true });
		setError(null);
	};

	// 편집 모드일 때 폼 데이터 설정
	useEffect(() => {
		if (editCategory) {
			setFormData({
				name: editCategory.name,
				description: editCategory.description || '',
				sort_order: editCategory.sort_order || 0,
				is_active: editCategory.is_active ?? true,
			});
		} else {
			resetForm();
		}
	}, [editCategory]);

	const handleClose = () => {
		if (!loading) {
			resetForm();
			onClose();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			setError('카테고리명을 입력해주세요.');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			if (editCategory) {
				// 편집 모드
				await categoryService.updateCategory(editCategory.id, {
					name: formData.name.trim(),
					description: formData.description.trim() || null,
					sort_order: formData.sort_order,
					is_active: formData.is_active,
				});
			} else {
				// 생성 모드
				const slug = formData.name
					.trim()
					.toLowerCase()
					.replace(/[^a-z0-9]/g, '_');

				await categoryService.createCategory({
					name: formData.name.trim(),
					description: formData.description.trim() || undefined,
					sort_order: formData.sort_order,
					slug,
					is_active: formData.is_active,
				});
			}

			resetForm();
			onSuccess();
			onClose();
		} catch (error) {
			console.error(editCategory ? '카테고리 수정 실패:' : '카테고리 생성 실패:', error);
			setError(
				error instanceof Error
					? error.message
					: editCategory
					? '카테고리 수정에 실패했습니다.'
					: '카테고리 생성에 실패했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-md w-full">
				{/* Header */}
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						{editCategory ? (
							<>
								<Pencil className="h-5 w-5" />
								카테고리 편집
							</>
						) : (
							<>
								<Plus className="h-5 w-5" />새 카테고리 생성
							</>
						)}
					</h2>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0" disabled={loading}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
					)}

					{/* 카테고리명 */}
					<DefaultInput
						label="카테고리명"
						required
						placeholder="예: test_idea"
						value={formData.name}
						onChange={(e) => handleChange('name', e.target.value)}
						disabled={loading}
						className="w-full"
					/>

					{/* 설명 */}
					<DefaultTextarea
						label="설명"
						placeholder="카테고리에 대한 간단한 설명을 작성해주세요..."
						value={formData.description}
						onChange={(e) => handleChange('description', e.target.value)}
						disabled={loading}
						rows={4}
						className="w-full text-sm "
					/>

					{/* 순서 */}
					<DefaultInput
						label="정렬 순서"
						type="number"
						placeholder="0"
						value={formData.sort_order}
						onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
						disabled={loading}
						min={0}
						className="w-full"
					/>
					<p className="text-xs text-gray-500">낮은 숫자일수록 먼저 표시됩니다.</p>

					{/* 활성화 여부 */}
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={formData.is_active}
							onChange={(e) => handleChange('is_active', e.target.checked)}
							disabled={loading}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500  rounded"
						/>
						<label className="text-sm font-medium text-gray-700">생성 후 즉시 활성화</label>
					</div>

					{/* 버튼 */}
					<div className="flex justify-end space-x-2 pt-4">
						<Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
							취소
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? '생성 중...' : '카테고리 생성'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

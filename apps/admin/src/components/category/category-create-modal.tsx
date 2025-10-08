import React, { useState, useEffect } from 'react';
import { type Category } from '@pickid/supabase';
import { Button, DefaultInput, DefaultTextarea } from '@pickid/ui';
import { Plus, X, Pencil } from 'lucide-react';

interface CategoryCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (categoryData?: {
		name: string;
		slug: string;
		sort_order?: number;
		status?: 'active' | 'inactive';
	}) => void;
	editCategory?: Category | null;
}

export function CategoryCreateModal({ isOpen, onClose, onSuccess, editCategory }: CategoryCreateModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		sort_order: 0,
		status: 'active' as 'active' | 'inactive',
	});

	const handleChange = (field: string, value: string | number | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (error) setError(null);
	};

	const resetForm = () => {
		setFormData({ name: '', sort_order: 0, status: 'active' });
		setError(null);
	};

	// 편집 모드일 때 폼 데이터 설정
	useEffect(() => {
		if (editCategory) {
			setFormData({
				name: editCategory.name,
				sort_order: editCategory.sort_order || 0,
				status: editCategory.status,
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
			// 더 나은 slug 생성 로직
			const baseSlug = formData.name
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9가-힣]/g, '') // 한글도 포함
				.replace(/[가-힣]/g, (match) => {
					// 한글을 영문으로 변환 (간단한 매핑)
					const map: { [key: string]: string } = {
						유: 'type',
						형: 'type',
						성: 'personality',
						향: 'tendency',
						분: 'analysis',
						석: 'analysis',
						테: 'test',
						스: 'test',
						심: 'psychology',
						리: 'psychology',
					};
					return map[match] || match;
				})
				.replace(/[^a-z0-9]/g, '-') // 나머지 특수문자를 하이픈으로
				.replace(/-+/g, '-') // 연속된 하이픈을 하나로
				.replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거

			// 빈 slug인 경우 기본값 사용
			const slug = baseSlug || 'category';

			const categoryData = {
				name: formData.name.trim(),
				sort_order: formData.sort_order,
				slug,
				status: formData.status,
			};

			resetForm();
			onSuccess(categoryData);
			onClose();
		} catch (error) {
			console.error('폼 처리 실패:', error);
			setError('폼 처리에 실패했습니다.');
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
							checked={formData.status === 'active'}
							onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
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
						<Button type="submit" loading={loading} loadingText="생성 중...">
							카테고리 생성
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DefaultInput, DefaultTextarea, Button } from '@pickid/ui';
import { useFeedback } from '../hooks';
import { FeedbackCategorySelector } from './feedback-category-selector';

interface FeedbackFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function FeedbackForm({ onSuccess, onCancel }: FeedbackFormProps) {
	const router = useRouter();
	const { submitFeedback, isLoading, error } = useFeedback();

	const [formData, setFormData] = useState({
		title: '',
		content: '',
		category: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = '제목을 입력해주세요.';
		} else if (formData.title.length < 2) {
			newErrors.title = '제목은 2자 이상 입력해주세요.';
		}

		if (!formData.content.trim()) {
			newErrors.content = '내용을 입력해주세요.';
		} else if (formData.content.length < 10) {
			newErrors.content = '내용은 10자 이상 입력해주세요.';
		}

		if (!formData.category) {
			newErrors.category = '카테고리를 선택해주세요.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await submitFeedback({
				title: formData.title.trim(),
				content: formData.content.trim(),
				category: formData.category,
			});

			if (onSuccess) {
				onSuccess();
			} else {
				router.push('/feedback');
			}
		} catch (err) {
			console.error('피드백 제출 실패:', err);
		}
	};

	return (
		<div className="max-w-3xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-1">피드백 보내기</h1>
				<p className="text-sm text-gray-600">의견을 들려주세요</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
					<FeedbackCategorySelector
						selectedCategory={formData.category}
						onCategoryChange={(category) => handleInputChange('category', category)}
						error={errors.category}
					/>

					<DefaultInput
						label="제목"
						required
						placeholder="제목을 입력해주세요"
						value={formData.title}
						onChange={(e) => handleInputChange('title', e.target.value)}
						error={errors.title}
					/>

					<DefaultTextarea
						label="내용"
						required
						placeholder="내용을 입력해주세요"
						value={formData.content}
						onChange={(e) => handleInputChange('content', e.target.value)}
						error={errors.content}
						rows={10}
					/>
				</div>

				{error && (
					<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				<div className="flex gap-2">
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
							취소
						</Button>
					)}
					<Button
						type="submit"
						className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
						loading={isLoading}
						loadingText="제출 중..."
					>
						제출하기
					</Button>
				</div>
			</form>
		</div>
	);
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DefaultInput, DefaultTextarea, Button } from '@pickid/ui';
import { useFeedbackSubmit } from '../hooks/useFeedback';
import { FeedbackCategorySelector } from './feedback-category-selector';

export function FeedbackForm() {
	const router = useRouter();
	const { mutate: submitFeedback, isPending } = useFeedbackSubmit();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		const newErrors: Record<string, string> = {};
		if (!title.trim()) newErrors.title = '제목을 입력해주세요.';
		else if (title.length < 2) newErrors.title = '제목은 2자 이상 입력해주세요.';
		if (!content.trim()) newErrors.content = '내용을 입력해주세요.';
		else if (content.length < 10) newErrors.content = '내용은 10자 이상 입력해주세요.';
		if (!category) newErrors.category = '카테고리를 선택해주세요.';

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		submitFeedback(
			{ title: title.trim(), content: content.trim(), category },
			{
				onSuccess: () => {
					router.push('/feedback');
				},
				onError: (error) => {
					setErrors({ submit: error instanceof Error ? error.message : '피드백 제출에 실패했습니다.' });
				},
			}
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-3xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-1">피드백 보내기</h1>
					<p className="text-sm text-gray-600">의견을 들려주세요</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
						<FeedbackCategorySelector
							selectedCategory={category}
							onCategoryChange={(cat) => {
								setCategory(cat);
								setErrors((prev) => ({ ...prev, category: '' }));
							}}
							error={errors.category}
						/>

						<DefaultInput
							label="제목"
							required
							placeholder="제목을 입력해주세요"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								setErrors((prev) => ({ ...prev, title: '' }));
							}}
							error={errors.title}
						/>

						<DefaultTextarea
							label="내용"
							required
							placeholder="내용을 입력해주세요"
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
								setErrors((prev) => ({ ...prev, content: '' }));
							}}
							error={errors.content}
							rows={10}
						/>
					</div>

					{errors.submit && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{errors.submit}</p>
						</div>
					)}

					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							className="flex-1"
							disabled={isPending}
						>
							취소
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
							loading={isPending}
							loadingText="제출 중..."
						>
							제출하기
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

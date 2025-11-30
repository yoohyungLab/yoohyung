import React, { useState } from 'react';
import { Button } from '@pickid/ui';

interface FeedbackReplyModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reply: string) => void;
}

export function FeedbackReplyModal({ isOpen, onClose, onSubmit }: FeedbackReplyModalProps) {
	const [replyText, setReplyText] = useState('');

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (!replyText.trim()) return;
		onSubmit(replyText);
		setReplyText('');
	};

	const handleClose = () => {
		setReplyText('');
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
				<h3 className="text-lg font-semibold mb-4 text-neutral-900">관리자 답변 추가</h3>
				<textarea
					value={replyText}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
					placeholder="답변을 입력하세요..."
					rows={4}
					className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent mb-4 text-sm resize-none"
				/>
				<div className="flex gap-2 justify-end">
					<Button variant="outline" onClick={handleClose} text="취소" />
					<Button onClick={handleSubmit} disabled={!replyText.trim()} text="답변 추가" />
				</div>
			</div>
		</div>
	);
}

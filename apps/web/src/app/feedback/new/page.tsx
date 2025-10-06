'use client';

import { FeedbackForm } from '@/features/feedback/ui/feedback-form';

export default function FeedbackNewPage() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<FeedbackForm />
			</div>
		</div>
	);
}

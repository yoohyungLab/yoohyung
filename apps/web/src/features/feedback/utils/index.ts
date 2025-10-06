import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from '@/shared/constants';

export const getCategoryInfo = (categoryName: string) => {
	return (
		FEEDBACK_CATEGORIES.find((cat) => cat.name === categoryName) || {
			name: categoryName,
			label: categoryName,
			emoji: '💭',
			description: '',
		}
	);
};

export const getStatusInfo = (status: string) => {
	const statusInfo = FEEDBACK_STATUS[status as keyof typeof FEEDBACK_STATUS];
	return statusInfo || { label: status, color: 'gray' };
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

export const formatDateTime = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const getStatusClassName = (color: string) => {
	switch (color) {
		case 'green':
			return 'bg-green-100 text-green-800';
		case 'blue':
			return 'bg-blue-100 text-blue-800';
		case 'yellow':
			return 'bg-yellow-100 text-yellow-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};

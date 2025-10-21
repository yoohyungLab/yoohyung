import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from '@/shared/constants/index';

const CATEGORY_EMOJIS: Record<string, string> = {
	bug: '🐛',
	feature: '💡',
	ui: '🎨',
	content: '📝',
	other: '💭',
};

const STATUS_COLORS: Record<string, string> = {
	pending: 'yellow',
	in_progress: 'blue',
	completed: 'green',
	replied: 'green',
	rejected: 'red',
};

export const getCategoryInfo = (categoryName: string) => {
	const categoryKey = categoryName as keyof typeof FEEDBACK_CATEGORIES;
	return {
		name: categoryName,
		label: FEEDBACK_CATEGORIES[categoryKey] || categoryName,
		emoji: CATEGORY_EMOJIS[categoryName] || '💭',
	};
};

export const getStatusInfo = (status: string) => {
	const statusKey = status as keyof typeof FEEDBACK_STATUS;
	return {
		status,
		label: FEEDBACK_STATUS[statusKey] || status,
		color: STATUS_COLORS[status] || 'gray',
	};
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

export const formatDateTime = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleString('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const getStatusClassName = (color: string) => {
	const colorMap: Record<string, string> = {
		yellow: 'bg-yellow-100 text-yellow-800',
		blue: 'bg-blue-100 text-blue-800',
		green: 'bg-green-100 text-green-800',
		red: 'bg-red-100 text-red-800',
		gray: 'bg-gray-100 text-gray-800',
	};
	return colorMap[color] || 'bg-gray-100 text-gray-800';
};

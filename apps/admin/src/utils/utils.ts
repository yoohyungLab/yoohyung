import { PROFILE_PROVIDER_LABELS, PROFILE_STATUS_CONFIG } from '../constants/user';
import { getTestStatusInfo } from './test.utils';

export const getStatusConfig = (type: 'profile' | 'feedback' | 'test' | 'category', status: string | boolean) => {
	if (type === 'profile') {
		const config = PROFILE_STATUS_CONFIG[status as keyof typeof PROFILE_STATUS_CONFIG];
		return config || { text: '알수없음', variant: 'default', icon: '🛡️' };
	}

	if (type === 'feedback') {
		switch (status) {
			case 'pending':
				return { text: '대기중', variant: 'warning' };
			case 'in_progress':
				return { text: '진행중', variant: 'info' };
			case 'completed':
				return { text: '완료', variant: 'success' };
			case 'replied':
				return { text: '답변완료', variant: 'secondary' };
			case 'rejected':
				return { text: '거부', variant: 'destructive' };
			default:
				return { text: '알수없음', variant: 'default' };
		}
	}

	if (type === 'test') {
		const statusInfo = getTestStatusInfo(status as string);
		const statusVariantMap: Record<string, 'success' | 'outline' | 'info' | 'destructive' | 'default'> = {
			published: 'success',
			draft: 'outline',
			scheduled: 'info',
			archived: 'destructive',
		};
		return {
			text: statusInfo.name,
			variant: statusVariantMap[status as string] || 'default',
		};
	}

	if (type === 'category') {
		const isActive = status === 'active';
		return {
			text: isActive ? '활성' : '비활성',
			variant: isActive ? 'success' : 'outline',
		};
	}

	return { text: '알수없음', variant: 'default' };
};

export const getLabelText = (type: 'provider', key: string): string => {
	switch (type) {
		case 'provider':
			return PROFILE_PROVIDER_LABELS[key as keyof typeof PROFILE_PROVIDER_LABELS] || '이메일';
		default:
			return key;
	}
};


export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short',
		timeZone: 'Asia/Seoul',
		...options,
	});
};

export const getDaysSinceJoin = (createdAt: string | Date) => {
	const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
	const now = new Date();

	const nowInKorea = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
	const createdInKorea = new Date(created.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

	const nowDate = new Date(nowInKorea.getFullYear(), nowInKorea.getMonth(), nowInKorea.getDate());
	const createdDate = new Date(createdInKorea.getFullYear(), createdInKorea.getMonth(), createdInKorea.getDate());

	return Math.floor((nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
};


export const formatNumber = (num: number) => {
	if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
	return num.toLocaleString();
};

export const formatGrowth = (growth: number | string) => {
	if (typeof growth === 'string') {
		return growth;
	}

	const sign = growth > 0 ? '+' : '';
	return `${sign}${growth.toFixed(1)}%`;
};

export const getGrowthColor = (growth: number | string) => {
	if (typeof growth === 'string') {
		switch (growth) {
			case 'up':
				return 'text-green-600';
			case 'down':
				return 'text-red-600';
			default:
				return 'text-gray-600';
		}
	}

	if (growth > 0) return 'text-green-600';
	if (growth < 0) return 'text-red-600';
	return 'text-gray-600';
};

export const getGrowthIcon = (growth: number | string) => {
	if (typeof growth === 'string') {
		switch (growth) {
			case 'up':
				return '↗️';
			case 'down':
				return '↘️';
			default:
				return '→';
		}
	}

	if (growth > 0) return '↗️';
	if (growth < 0) return '↘️';
	return '→';
};

export const getColor = (type: 'alert' | 'priority', value: string) => {
	if (type === 'alert') {
		switch (value) {
			case 'error':
				return 'border-red-500 bg-red-50';
			case 'warning':
				return 'border-yellow-500 bg-yellow-50';
			case 'success':
				return 'border-green-500 bg-green-50';
			default:
				return 'border-blue-500 bg-blue-50';
		}
	}

	if (type === 'priority') {
		switch (value) {
			case 'completed':
			case 'resolved':
				return 'from-green-50 to-emerald-50';
			case 'in_progress':
				return 'from-blue-50 to-cyan-50';
			case 'rejected':
				return 'from-red-50 to-pink-50';
			default:
				return 'from-yellow-50 to-orange-50';
		}
	}

	return 'border-gray-500 bg-gray-50';
};

export const getKPIColorClasses = (color: 'blue' | 'green' | 'purple' | 'orange') => {
	const colorMap = {
		blue: {
			border: 'border-l-blue-500',
			value: 'text-blue-600',
			icon: 'text-blue-500',
		},
		green: {
			border: 'border-l-green-500',
			value: 'text-green-600',
			icon: 'text-green-500',
		},
		purple: {
			border: 'border-l-purple-500',
			value: 'text-purple-600',
			icon: 'text-purple-500',
		},
		orange: {
			border: 'border-l-orange-500',
			value: 'text-orange-600',
			icon: 'text-orange-500',
		},
	};
	return colorMap[color];
};

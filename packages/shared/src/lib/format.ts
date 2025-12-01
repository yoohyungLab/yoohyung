export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Seoul',
		...options,
	});
};

export const formatDateLong = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Seoul',
		...options,
	});
};

export const formatTime = (date: string | Date) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleTimeString('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Seoul',
	});
};

export const formatDuration = (seconds: number) => {
	if (seconds < 60) return `${seconds}초`;
	if (seconds < 3600) return `${Math.round(seconds / 60)}분`;
	return `${Math.round(seconds / 3600)}시간`;
};

export const formatNumber = (num: number | null | undefined): string => {
	if (num === null || num === undefined) return '0';
	if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
	return num.toLocaleString('ko-KR');
};

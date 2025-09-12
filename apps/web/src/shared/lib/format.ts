export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}초`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}분`;
    return `${Math.round(seconds / 3600)}시간`;
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string) {
	const now = new Date();
	const targetDate = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

	if (diffInSeconds < 60) return '방금 전';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
	if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
	return `${Math.floor(diffInSeconds / 31536000)}년 전`;
}

// 문자열 유틸리티
export function truncate(str: string, length: number) {
	return str.length > length ? str.substring(0, length) + '...' : str;
}

export function slugify(str: string) {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9가-힣]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

// 배열 유틸리티
export function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

export function unique<T>(array: T[]): T[] {
	return [...new Set(array)];
}

// 객체 유틸리티
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const result = { ...obj };
	keys.forEach((key) => delete result[key]);
	return result;
}

export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>;
	keys.forEach((key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
	});
	return result;
}

// 숫자 유틸리티
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function random(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 검증 유틸리티
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

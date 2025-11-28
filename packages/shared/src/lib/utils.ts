import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Supabase 유틸리티
export function isNotFoundError(error: unknown): boolean {
	return (error as { code?: string })?.code === 'PGRST116';
}

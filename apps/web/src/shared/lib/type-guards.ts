import type { Json } from '@pickid/supabase';

/**
 * Type guard to check if Json is a string
 */
export function isString(value: Json | undefined): value is string {
	return typeof value === 'string';
}

/**
 * Type guard to check if Json is a number
 */
export function isNumber(value: Json | undefined): value is number {
	return typeof value === 'number';
}

/**
 * Type guard to check if Json is an array
 */
export function isArray(value: Json | undefined): value is Json[] {
	return Array.isArray(value);
}

/**
 * Type guard to check if Json is a string array
 */
export function isStringArray(value: Json | undefined): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Type guard to check if Json is an object
 */
export function isObject(value: Json | undefined): value is { [key: string]: Json | undefined } {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safely converts Json to string, returns fallback if not a string
 */
export function asString(value: Json | undefined, fallback = ''): string {
	return isString(value) ? value : fallback;
}

/**
 * Safely converts Json to number, returns fallback if not a number
 */
export function asNumber(value: Json | undefined, fallback = 0): number {
	return isNumber(value) ? value : fallback;
}

/**
 * Safely converts Json to string array, returns fallback if not a string array
 */
export function asStringArray(value: Json | undefined, fallback: string[] = []): string[] {
	return isStringArray(value) ? value : fallback;
}

/**
 * Safely converts Json to object, returns fallback if not an object
 */
export function asObject(value: Json | undefined, fallback: Record<string, unknown> = {}): Record<string, unknown> {
	return isObject(value) ? (value as Record<string, unknown>) : fallback;
}

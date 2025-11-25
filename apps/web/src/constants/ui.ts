/**
 * UI Constants
 *
 * 테마, 색상 등 UI 관련 상수를 정의합니다.
 */

export type TColorTheme = {
	name: string;
	gradient: string;
	primary: string;
	accent: string;
	secondary: string;
	button: string;
	progress: string;
	question: string;
	choice: string;
	background: string;
};

export const COLOR_THEMES: TColorTheme[] = [
	{
		name: 'purple',
		gradient: 'from-rose-100 via-pink-100 to-amber-100',
		primary: 'rose',
		accent: 'amber',
		secondary: 'pink',
		button: 'from-pink-500 to-amber-500',
		progress: 'from-pink-400 to-amber-400',
		question: 'from-rose-50 to-pink-50',
		choice: 'rose',
		background: 'rose',
	},
	{
		name: 'blue',
		gradient: 'from-blue-100 via-cyan-100 to-teal-100',
		primary: 'blue',
		accent: 'cyan',
		secondary: 'teal',
		button: 'from-blue-500 via-cyan-500 to-blue-500',
		progress: 'from-blue-400 via-cyan-400 to-teal-400',
		question: 'from-blue-50 to-cyan-50',
		choice: 'blue',
		background: 'blue',
	},
	{
		name: 'green',
		gradient: 'from-green-100 via-emerald-100 to-lime-100',
		primary: 'green',
		accent: 'emerald',
		secondary: 'lime',
		button: 'from-green-500 via-emerald-500 to-green-500',
		progress: 'from-green-400 via-emerald-400 to-lime-400',
		question: 'from-green-50 to-emerald-50',
		choice: 'green',
		background: 'green',
	},
	{
		name: 'orange',
		gradient: 'from-orange-100 via-amber-100 to-yellow-100',
		primary: 'orange',
		accent: 'amber',
		secondary: 'yellow',
		button: 'from-orange-500 via-amber-500 to-orange-500',
		progress: 'from-orange-400 via-amber-400 to-yellow-400',
		question: 'from-orange-50 to-amber-50',
		choice: 'orange',
		background: 'orange',
	},
	{
		name: 'red',
		gradient: 'from-red-100 via-rose-100 to-pink-100',
		primary: 'red',
		accent: 'rose',
		secondary: 'pink',
		button: 'from-red-500 via-rose-500 to-red-500',
		progress: 'from-red-400 via-rose-400 to-pink-400',
		question: 'from-red-50 to-rose-50',
		choice: 'red',
		background: 'red',
	},
] as const;

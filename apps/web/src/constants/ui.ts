// ColorTheme 타입 정의 (실제 사용되는 필드만)
export type TColorTheme = {
	gradient: string;
	button: string;
	progress: string;
	question: string;
};

export const COLOR_THEMES: TColorTheme[] = [
	{
		gradient: 'from-rose-100 via-pink-100 to-amber-100',
		button: 'from-pink-500 to-amber-500',
		progress: 'from-pink-400 to-amber-400',
		question: 'from-rose-50 to-pink-50',
	},
	{
		gradient: 'from-blue-100 via-cyan-100 to-teal-100',
		button: 'from-blue-500 via-cyan-500 to-blue-500',
		progress: 'from-blue-400 via-cyan-400 to-teal-400',
		question: 'from-blue-50 to-cyan-50',
	},
	{
		gradient: 'from-green-100 via-emerald-100 to-lime-100',
		button: 'from-green-500 via-emerald-500 to-green-500',
		progress: 'from-green-400 via-emerald-400 to-lime-400',
		question: 'from-green-50 to-emerald-50',
	},
	{
		gradient: 'from-orange-100 via-amber-100 to-yellow-100',
		button: 'from-orange-500 via-amber-500 to-orange-500',
		progress: 'from-orange-400 via-amber-400 to-yellow-400',
		question: 'from-orange-50 to-amber-50',
	},
	{
		gradient: 'from-red-100 via-rose-100 to-pink-100',
		button: 'from-red-500 via-rose-500 to-red-500',
		progress: 'from-red-400 via-rose-400 to-pink-400',
		question: 'from-red-50 to-rose-50',
	},
];

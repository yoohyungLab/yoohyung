// ColorTheme 타입 정의
export type TColorTheme = {
	name: string;
	gradient: string;
	button: string;
	progress: string;
	question: string;
};

// COLOR_THEMES를 객체로 변경
export const COLOR_THEMES: Record<string, Omit<TColorTheme, 'name'>> = {
	rose: {
		gradient: 'from-rose-100 via-pink-100 to-amber-100',
		button: 'from-pink-500 to-amber-500',
		progress: 'from-pink-400 to-amber-400',
		question: 'from-rose-50 to-pink-50',
	},
	blue: {
		gradient: 'from-blue-100 via-cyan-100 to-teal-100',
		button: 'from-blue-500 via-cyan-500 to-blue-500',
		progress: 'from-blue-400 via-cyan-400 to-teal-400',
		question: 'from-blue-50 to-cyan-50',
	},
	green: {
		gradient: 'from-green-100 via-emerald-100 to-lime-100',
		button: 'from-green-500 via-emerald-500 to-green-500',
		progress: 'from-green-400 via-emerald-400 to-lime-400',
		question: 'from-green-50 to-emerald-50',
	},
	orange: {
		gradient: 'from-orange-100 via-amber-100 to-yellow-100',
		button: 'from-orange-500 via-amber-500 to-orange-500',
		progress: 'from-orange-400 via-amber-400 to-yellow-400',
		question: 'from-orange-50 to-amber-50',
	},
	red: {
		gradient: 'from-red-100 via-rose-100 to-pink-100',
		button: 'from-red-500 via-rose-500 to-red-500',
		progress: 'from-red-400 via-rose-400 to-pink-400',
		question: 'from-red-50 to-rose-50',
	},
};

// COUNT_GRADIENTS 대신 사용할 객체 (COLOR_THEMES.button 값을 참조)
export const COUNT_GRADIENTS = Object.entries(COLOR_THEMES).reduce(
	(acc, [key, value]) => {
		acc[key] = value.button;
		return acc;
	},
	{} as Record<string, string>
);

// BALANCE_GAME_COLORS
export const BALANCE_GAME_COLORS = {
	A: {
		background: 'bg-red-100',
		gradient: 'bg-gradient-to-br from-red-100 to-red-200',
		border: 'border-red-300',
		gradientBarBg: 'bg-red-100',
		gradientBar: 'bg-gradient-to-r from-red-400 to-red-500',
		badge: 'bg-red-500 text-white',
	},
	B: {
		background: 'bg-blue-100',
		gradient: 'bg-gradient-to-br from-blue-100 to-blue-200',
		border: 'border-blue-300',
		gradientBarBg: 'bg-blue-100',
		gradientBar: 'bg-gradient-to-r from-blue-400 to-blue-500',
		badge: 'bg-blue-500 text-white',
	},
	neutral: {
		background: 'bg-gray-50',
		border: 'border-gray-200',
		gradientBarBg: 'bg-gray-100',
		gradientBar: 'bg-gradient-to-r from-gray-400 to-gray-500',
	},
	vs: {
		background: 'bg-white',
		border: 'border-2 border-gray-200',
	},
} as const;

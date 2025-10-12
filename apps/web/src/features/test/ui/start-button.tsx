import type { ColorTheme } from '../lib';

interface IStartButtonProps {
	onClick: () => void;
	theme: ColorTheme;
}

export function StartButton({ onClick, theme }: IStartButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black py-5 rounded-2xl hover:bg-right transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-98 text-lg animate-gradient`}
		>
			시작하기
		</button>
	);
}

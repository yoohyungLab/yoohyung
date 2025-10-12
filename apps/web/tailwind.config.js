/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/entities/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/shared/**/*.{js,ts,jsx,tsx,mdx}',
		'../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			// shadcn/ui 색상 시스템 (실제 사용되는 것만)
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				sans: [
					'S-CoreDream',
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'Apple SD Gothic Neo',
					'Noto Sans KR',
					'Malgun Gothic',
					'sans-serif',
				],
			},
			// 모바일 우선 반응형 브레이크포인트
			screens: {
				xs: '375px', // iPhone SE
				sm: '640px', // iPhone 12 Pro
				md: '768px', // iPad
				lg: '1024px', // iPad Pro
				xl: '1280px', // Desktop
				'2xl': '1536px', // Large Desktop
			},
			maxWidth: {
				mobile: '510px',
				tablet: '768px',
				desktop: '1024px',
			},
			// 터치 친화적 크기
			spacing: {
				touch: '44px', // 최소 터치 타겟 크기
			},
			// 모바일 최적화 애니메이션
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
			},
		},
	},
	plugins: [],
};

export default config;

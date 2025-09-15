/**
 * Design System Tokens
 * 20년차 UI/UX 전문가 기준으로 설계된 일관성 있는 디자인 토큰
 * 한글 타이포그래피 최적화 및 모바일 우선 디자인 적용
 */

export const designTokens = {
    // Typography Scale - 한글 최적화 타이포그래피
    typography: {
        // Display (화면 타이틀)
        display: {
            xl: { size: '32px', weight: 800, lineHeight: '40px', letterSpacing: '-0.64px' },
            lg: { size: '28px', weight: 800, lineHeight: '36px', letterSpacing: '-0.56px' },
            md: { size: '24px', weight: 700, lineHeight: '32px', letterSpacing: '-0.48px' },
        },

        // Heading (섹션 제목)
        heading: {
            xl: { size: '22px', weight: 700, lineHeight: '30px', letterSpacing: '-0.44px' },
            lg: { size: '20px', weight: 700, lineHeight: '28px', letterSpacing: '-0.4px' },
            md: { size: '18px', weight: 600, lineHeight: '26px', letterSpacing: '-0.36px' },
            sm: { size: '16px', weight: 600, lineHeight: '24px', letterSpacing: '-0.32px' },
        },

        // Body (본문)
        body: {
            lg: { size: '16px', weight: 400, lineHeight: '26px', letterSpacing: '-0.16px' },
            md: { size: '14px', weight: 400, lineHeight: '22px', letterSpacing: '-0.14px' },
            sm: { size: '12px', weight: 400, lineHeight: '18px', letterSpacing: '-0.12px' },
        },

        // Caption (캡션, 라벨)
        caption: {
            lg: { size: '11px', weight: 500, lineHeight: '16px', letterSpacing: '-0.11px' },
            md: { size: '10px', weight: 500, lineHeight: '14px', letterSpacing: '-0.1px' },
        },
    },

    // Color Palette
    colors: {
        // Base (그레이스케일)
        base: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#bdc1c6',
            500: '#9aa0a6',
            600: '#80868b',
            700: '#5f6368',
            800: '#3c4043',
            900: '#202124',
            950: '#0d0d0d',
        },

        // Primary (브랜드 메인 컬러)
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },

        // Success
        success: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
        },

        // Warning
        warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
        },

        // Error
        error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
        },

        // Semantic colors
        background: '#ffffff',
        foreground: '#0d0d0d',
        muted: '#f8f9fa',
        'muted-foreground': '#80868b',
        border: '#e8eaed',
        ring: '#0ea5e9',
    },

    // Spacing (8px 기반)
    spacing: {
        0: '0',
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        16: '4rem', // 64px
        20: '5rem', // 80px
        24: '6rem', // 96px
    },

    // Border Radius
    radius: {
        none: '0',
        sm: '0.25rem', // 4px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        full: '9999px',
    },

    // Shadows
    shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },

    // Common Sizes
    common: {
        width: '475px',
        maxWidth: '475px',
        padding: '20px',
        radius: '8px',
    },
} as const;

export type DesignTokens = typeof designTokens;

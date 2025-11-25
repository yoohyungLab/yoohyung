/**
 * 공통 색상 유틸리티 함수들
 */

/**
 * Hex 색상을 RGBA로 변환
 */
export function hexToRgba(hex: string, alpha: number): string {
	const cleanHex = hex.replace('#', '');
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 색상 밝기 조정
 */
export function adjustColor(hex: string, lum: number): string {
	// validate hex string
	hex = hex.replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	let rgb = '#',
		c,
		i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
		rgb += ('00' + c).substr(c.length);
	}

	return rgb;
}

/**
 * 테마 색상에 따른 배경 그라디언트 생성
 */
export function getBackgroundGradient(themeColor: string): string {
	const baseColor = themeColor || '#3B82F6';
	// 주황 계열 등 강한 색상은 더 연한 톤을 함께 사용하여 2색 그라데이션
	const light = hexToRgba(baseColor, 0.25);
	const lighter = hexToRgba(baseColor, 0.1);
	return `linear-gradient(135deg, ${lighter} 0%, ${light} 100%)`;
}

/**
 * 테마 색상 기반으로 다양한 색상 팔레트 생성
 */
export function getThemedColors(baseColor: string) {
	const hex = baseColor.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return {
		surface: `${baseColor}08`,
		border: `${baseColor}15`,
		dot: baseColor,
		pastelBg: `rgba(${r}, ${g}, ${b}, 0.12)`,
		pastelText: `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, 1)`,
	};
}

/**
 * 공통 스타일 객체 생성
 */
export function createCardStyles(colors: ReturnType<typeof getThemedColors>) {
	return {
		border: `1px solid ${colors.border}`,
		boxShadow: `
			0 4px 16px rgba(0, 0, 0, 0.06),
			inset 0 1px 2px rgba(255, 255, 255, 0.5)
		`,
	};
}

/**
 * 배경 장식 스타일 생성
 */
export function createDecorationStyle(themeColor: string, opacity: number = 0.2) {
	return {
		background: `radial-gradient(circle, ${themeColor}${Math.round(opacity * 255)
			.toString(16)
			.padStart(2, '0')} 0%, transparent 70%)`,
	};
}

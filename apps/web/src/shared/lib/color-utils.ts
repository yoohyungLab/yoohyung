/**
 * 공통 색상 유틸리티 함수들
 */

/**
 * Hex 색상을 RGBA로 변환
 */
export function hexToRgba(hex: string, alpha: number): string {
	const cleanHex = hex.replace('#', '');
	const r = parseInt(cleanHex.substr(0, 2), 16);
	const g = parseInt(cleanHex.substr(2, 2), 16);
	const b = parseInt(cleanHex.substr(4, 2), 16);
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
	const lightColor = hexToRgba(baseColor, 0.08);
	const lighterColor = hexToRgba(baseColor, 0.12);

	return `linear-gradient(135deg, ${lightColor} 0%, white 50%, ${lighterColor} 100%)`;
}

/**
 * 테마 색상 기반으로 다양한 색상 팔레트 생성
 */
export function getThemedColors(baseColor: string) {
	const hex = baseColor.replace('#', '');
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	return {
		surface: `${baseColor}08`,
		border: `${baseColor}15`,
		dot: baseColor,
		pastelBg: `rgba(${r}, ${g}, ${b}, 0.12)`,
		pastelText: `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, 1)`,
	};
}

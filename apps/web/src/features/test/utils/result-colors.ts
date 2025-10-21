/**
 * 테스트 결과 색상 유틸리티
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

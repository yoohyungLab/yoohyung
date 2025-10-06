export function formatPhoneNumber(phone?: string): string {
	if (!phone) return '';

	// 숫자만 추출
	const numbers = phone.replace(/\D/g, '');

	// 한국 휴대폰 번호 형식으로 포맷팅
	if (numbers.length === 11 && numbers.startsWith('010')) {
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
	}

	return phone;
}

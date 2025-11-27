// 이미지 프리로드 유틸리티
//
// 로딩 화면이 표시되는 동안 결과 이미지를 미리 로드하여
// 결과 페이지 전환 시 이미지가 즉시 보이도록 최적화

const preloadedImages = new Set<string>();

// 이미지 URL을 미리 로드
// - 중복 로드 방지
// - 브라우저 캐시 활용
export function preloadImage(url: string | null | undefined): void {
	if (!url || typeof window === 'undefined') return;

	// 이미 로드한 이미지는 스킵
	if (preloadedImages.has(url)) return;

	// Image 객체를 통한 프리로드
	const img = new Image();
	img.src = url;

	// 로드 완료/실패 시 Set에 추가하여 중복 방지
	img.onload = () => preloadedImages.add(url);
	img.onerror = () => preloadedImages.add(url);
}

// 여러 이미지를 한번에 프리로드
export function preloadImages(urls: (string | null | undefined)[]): void {
	urls.forEach(preloadImage);
}

// 프리로드 캐시 초기화 (테스트용)
export function clearPreloadCache(): void {
	preloadedImages.clear();
}

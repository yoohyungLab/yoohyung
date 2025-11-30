const preloadedImages = new Set<string>();

export function preloadImage(url: string | null | undefined): void {
	if (!url || typeof window === 'undefined') return;

	if (preloadedImages.has(url)) return;

	const img = new Image();
	img.src = url;

	img.onload = () => preloadedImages.add(url);
	img.onerror = () => preloadedImages.add(url);
}

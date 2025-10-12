// Core Web Vitals 측정 및 최적화
export const measureWebVitals = () => {
	// LCP (Largest Contentful Paint) 측정
	const measureLCP = () => {
		if ('PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1];
				console.log('LCP:', lastEntry.startTime);

				// LCP가 2.5초를 초과하면 경고
				if (lastEntry.startTime > 2500) {
					console.warn('LCP is slow:', lastEntry.startTime);
				}
			});
			observer.observe({ entryTypes: ['largest-contentful-paint'] });
		}
	};

	// FID (First Input Delay) 측정
	const measureFID = () => {
		if ('PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				entries.forEach((entry: any) => {
					if (entry.processingStart) {
						const fid = entry.processingStart - entry.startTime;
						console.log('FID:', fid);

						// FID가 100ms를 초과하면 경고
						if (fid > 100) {
							console.warn('FID is slow:', fid);
						}
					}
				});
			});
			observer.observe({ entryTypes: ['first-input'] });
		}
	};

	// CLS (Cumulative Layout Shift) 측정
	const measureCLS = () => {
		if ('PerformanceObserver' in window) {
			let clsValue = 0;
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
					if (!entry.hadRecentInput && entry.value) {
						clsValue += entry.value;
					}
				});
				console.log('CLS:', clsValue);

				// CLS가 0.1을 초과하면 경고
				if (clsValue > 0.1) {
					console.warn('CLS is poor:', clsValue);
				}
			});
			observer.observe({ entryTypes: ['layout-shift'] });
		}
	};

	// 모든 메트릭 측정 시작
	measureLCP();
	measureFID();
	measureCLS();
};

// 이미지 지연 로딩 최적화
export const optimizeImageLoading = () => {
	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target as HTMLImageElement;
					if (img.dataset.src) {
						img.src = img.dataset.src;
						img.removeAttribute('data-src');
						imageObserver.unobserve(img);
					}
				}
			});
		});

		// 지연 로딩이 필요한 이미지들 관찰
		document.querySelectorAll('img[data-src]').forEach((img) => {
			imageObserver.observe(img);
		});
	}
};

// 리소스 힌트 추가
export const addResourceHints = () => {
	// DNS prefetch
	const dnsPrefetchDomains = ['https://fonts.googleapis.com', 'https://cdn.jsdelivr.net', 'https://pickid.co.kr'];

	dnsPrefetchDomains.forEach((domain) => {
		const link = document.createElement('link');
		link.rel = 'dns-prefetch';
		link.href = domain;
		document.head.appendChild(link);
	});

	// Preconnect
	const preconnectDomains = ['https://fonts.gstatic.com'];

	preconnectDomains.forEach((domain) => {
		const link = document.createElement('link');
		link.rel = 'preconnect';
		link.href = domain;
		link.crossOrigin = 'anonymous';
		document.head.appendChild(link);
	});
};

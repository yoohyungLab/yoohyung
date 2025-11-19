'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@pickid/ui';
import { X } from 'lucide-react';

// 광고 배너 설정
const AD_BANNER_CONFIG = {
	imageUrl: '/images/workai-banner.png',
	linkUrl: 'https://afterworkai.club/',
} as const;

export function AdBannerSticky() {
	const [isClosed, setIsClosed] = useState(false);
	const [isOpened, setIsOpened] = useState(false); // 애니메이션 상태 제어 (열림/닫힘)

	// 컴포넌트 마운트 시 (클라이언트 측 렌더링 후) 즉시 열림 애니메이션 시작
	useEffect(() => {
		// isOpened를 true로 설정하여 translate-y-full -> translate-y-0으로 전환
		setIsOpened(true);
		// localStorage 관련 로직은 삭제됨
	}, []);

	const handleClose = () => {
		// 닫힘 애니메이션 시작 (translate-y-0 -> translate-y-full)
		setIsOpened(false);

		// 애니메이션이 완료될 시간(500ms)을 기다린 후 DOM에서 컴포넌트 제거
		setTimeout(() => {
			setIsClosed(true);
		}, 500); // Tailwind CSS의 duration-500과 일치

		// REMOVED: localStorage.setItem(storageKey, 'true');
	};

	const handleClick = () => {
		if (AD_BANNER_CONFIG.linkUrl) {
			window.open(AD_BANNER_CONFIG.linkUrl, '_blank', 'noopener,noreferrer');
		}
	};

	if (isClosed) return null; // 완전히 닫히면 DOM에서 제거

	// isOpened 상태에 따라 슬라이드 애니메이션 클래스 적용
	const animationClass = isOpened ? 'translate-y-0' : 'translate-y-full';

	return (
		// 전체 화면 너비를 차지하며 하단에 고정
		// overflow-hidden을 추가하여 배너가 아래로 슬라이드할 때 잘리게 함
		<div className="fixed bottom-0 left-0 right-0 z-50 w-screen flex justify-center overflow-hidden">
			{/* Dev 래핑 컴포넌트: 최대 너비, 중앙 정렬, 슬라이드 애니메이션 적용 */}
			<div
				className={`
          relative bg-white border-t shadow-2xl w-full
          transition-transform duration-500 ease-in-out ${animationClass}
        `}
			>
				{/* 닫기 버튼: 완전히 동그랗게 유지 */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleClose}
					className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 z-10 flex items-center justify-center transition-colors"
					aria-label="광고 닫기"
				>
					<X className="w-4 h-4" />
				</Button>

				{/* 배너 이미지 컨테이너: 900:450 비율 유지, 최대 높이 400px */}
				<div className="mx-auto w-full">
					<button
						onClick={handleClick}
						className="relative w-full cursor-pointer block"
						style={{ aspectRatio: '900/450', maxHeight: '300px' }}
						aria-label="광고 배너 클릭"
					>
						<Image
							src={AD_BANNER_CONFIG.imageUrl}
							alt="광고 배너"
							fill
							className="object-contain"
							sizes="(max-width: 900px) 100vw, 900px"
							loading="lazy"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

'use client';

import Image from 'next/image';

export function AdBannerInline() {
	const handleClick = () => {
		window.open('https://afterworkai.club/', '_blank', 'noopener,noreferrer');
	};

	return (
		<div className="w-full my-8">
			<div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-md">
				<button
					onClick={handleClick}
					className="relative w-full cursor-pointer block"
					style={{ aspectRatio: '900/450' }}
					aria-label="광고 배너 클릭"
				>
					<Image
						src="/images/workai-banner.png"
						alt="광고 배너"
						fill
						className="object-cover"
						sizes="(max-width: 900px) 100vw, 900px"
						loading="lazy"
					/>
				</button>
			</div>
		</div>
	);
}

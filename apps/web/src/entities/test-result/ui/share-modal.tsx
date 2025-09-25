import { useState, useEffect } from 'react';
import { trackResultShared } from '@/shared/lib/analytics';

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	resultType: string;
	totalScore: number;
	title: string;
	description: string;
	emoji: string;
}

export function ShareModal({ isOpen, onClose, resultType, totalScore, title, description, emoji }: ShareModalProps) {
	const [copied, setCopied] = useState(false);
	const [shareUrl, setShareUrl] = useState('');

	useEffect(() => {
		if (isOpen) {
			// 실제 URL 생성 (현재 페이지 URL + 결과 파라미터)
			const currentUrl = window.location.origin + window.location.pathname;
			const url = new URL(currentUrl);
			url.searchParams.set('type', resultType);
			url.searchParams.set('score', totalScore.toString());
			url.searchParams.set('shared', 'true');
			setShareUrl(url.toString());
		}
	}, [isOpen, resultType, totalScore]);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			trackResultShared('copy_link', 'egen-teto', resultType);
		} catch (err) {
			console.error('링크 복사 실패:', err);
			// 폴백: 텍스트 영역을 사용한 복사
			const textArea = document.createElement('textarea');
			textArea.value = shareUrl;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			trackResultShared('copy_link', 'egen-teto', resultType);
		}
	};

	const handleKakaoShare = () => {
		// 카카오톡 공유 (실제 구현 시 Kakao SDK 필요)
		if (
			(
				window as unknown as {
					Kakao?: { Share: { sendDefault: (options: unknown) => void } };
				}
			).Kakao
		) {
			(
				window as unknown as {
					Kakao: { Share: { sendDefault: (options: unknown) => void } };
				}
			).Kakao.Share.sendDefault({
				objectType: 'text',
				text: `나의 성향 테스트 결과: ${title}`,
				link: {
					mobileWebUrl: shareUrl,
					webUrl: shareUrl,
				},
			});
			trackResultShared('kakao', 'egen-teto', resultType);
		} else {
			// 폴백: 링크 복사
			handleCopyLink();
		}
	};

	const handleInstagramShare = () => {
		// 인스타그램 스토리 공유 (실제 구현 시 Instagram API 필요)
		const instagramUrl = `https://www.instagram.com/create/story/`;
		window.open(instagramUrl, '_blank');
		trackResultShared('instagram', 'egen-teto', resultType);
	};

	const handleDownloadImage = () => {
		// 이미지 카드 다운로드 (Canvas API 사용)
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = 1200;
		canvas.height = 628;

		// 배경 그라데이션
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, '#f3e8ff');
		gradient.addColorStop(1, '#dbeafe');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 제목
		ctx.fillStyle = '#1f2937';
		ctx.font = 'bold 48px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`${emoji} ${title}`, canvas.width / 2, 150);

		// 설명
		ctx.fillStyle = '#6b7280';
		ctx.font = '24px Arial';
		ctx.fillText(description, canvas.width / 2, 200);

		// 점수
		ctx.fillStyle = '#3b82f6';
		ctx.font = 'bold 36px Arial';
		ctx.fillText(`${totalScore}점`, canvas.width / 2, 300);

		// 게이지 바
		const barWidth = 400;
		const barHeight = 20;
		const barX = (canvas.width - barWidth) / 2;
		const barY = 350;

		// 배경 바
		ctx.fillStyle = '#e5e7eb';
		ctx.fillRect(barX, barY, barWidth, barHeight);

		// 점수 바
		const scoreWidth = (totalScore / 100) * barWidth;
		const barGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
		barGradient.addColorStop(0, '#ec4899');
		barGradient.addColorStop(1, '#3b82f6');
		ctx.fillStyle = barGradient;
		ctx.fillRect(barX, barY, scoreWidth, barHeight);

		// URL
		ctx.fillStyle = '#9ca3af';
		ctx.font = '20px Arial';
		ctx.fillText('TypologyLab.com', canvas.width / 2, 450);

		// 다운로드
		const link = document.createElement('a');
		link.download = `typology-result-${resultType}.png`;
		link.href = canvas.toDataURL();
		link.click();
		trackResultShared('image_download', 'egen-teto', resultType);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				{/* 헤더 */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">결과 공유하기</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
						×
					</button>
				</div>

				{/* 콘텐츠 */}
				<div className="p-6 space-y-6">
					{/* 미리보기 */}
					<div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-4 text-center">
						<div className="text-4xl mb-2">{emoji}</div>
						<h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
						<p className="text-sm text-gray-600 mb-3">{description}</p>
						<div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full">
							<span className="text-sm font-medium text-gray-700">{totalScore}점</span>
						</div>
					</div>

					{/* 공유 옵션 */}
					<div className="space-y-3">
						{/* 링크 복사 */}
						<button
							onClick={handleCopyLink}
							className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
						>
							<span className="text-xl">🔗</span>
							<span>{copied ? '복사됨!' : '링크 복사'}</span>
						</button>

						{/* 카카오톡 공유 */}
						<button
							onClick={handleKakaoShare}
							className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
						>
							<span className="text-xl">💬</span>
							<span>카카오톡으로 공유</span>
						</button>

						{/* 인스타그램 공유 */}
						<button
							onClick={handleInstagramShare}
							className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
						>
							<span className="text-xl">📸</span>
							<span>인스타그램 스토리</span>
						</button>

						{/* 이미지 다운로드 */}
						<button
							onClick={handleDownloadImage}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
						>
							<span className="text-xl">📱</span>
							<span>이미지 카드 다운로드</span>
						</button>
					</div>

					{/* URL 표시 */}
					<div className="bg-gray-50 rounded-lg p-3">
						<p className="text-xs text-gray-500 mb-2">공유 링크:</p>
						<p className="text-sm text-gray-700 break-all">{shareUrl}</p>
					</div>

					{/* 안내 메시지 */}
					<div className="text-center">
						<p className="text-xs text-gray-500">💡 친구들과 함께 테스트하고 결과를 비교해보세요!</p>
					</div>
				</div>
			</div>
		</div>
	);
}

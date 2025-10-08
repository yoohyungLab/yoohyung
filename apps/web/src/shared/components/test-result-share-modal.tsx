import { useState, useEffect } from 'react';

interface TestResultShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	resultType: string;
	totalScore: number;
	title: string;
	description: string;
	emoji: string;
}

export function TestResultShareModal({ isOpen, onClose, resultType, totalScore, title, description, emoji }: TestResultShareModalProps) {
	const [copied, setCopied] = useState(false);
	const [shareUrl, setShareUrl] = useState('');

	useEffect(() => {
		if (isOpen) {
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
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl max-w-md w-full">
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

					{/* 링크 복사 */}
					<button
						onClick={handleCopyLink}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
					>
						<span className="text-xl">🔗</span>
						<span>{copied ? '복사됨!' : '링크 복사'}</span>
					</button>

					{/* URL 표시 */}
					<div className="bg-gray-50 rounded-lg p-3">
						<p className="text-xs text-gray-500 mb-2">공유 링크:</p>
						<p className="text-sm text-gray-700 break-all">{shareUrl}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

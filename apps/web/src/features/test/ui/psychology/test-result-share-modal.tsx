'use client';

import { useState, useEffect } from 'react';

interface ITestResultShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	resultType: string;
	totalScore: number;
	title: string;
	description: string;
	emoji: string;
	thumbnailUrl?: string;
}

export function TestResultShareModal(props: ITestResultShareModalProps) {
	const { isOpen, onClose, resultType, totalScore, title, description, emoji } = props;
	const [copied, setCopied] = useState(false);
	const [shareUrl, setShareUrl] = useState('');
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
	}, []);

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
		} catch {
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

	const handleNativeShare = async () => {
		try {
			await navigator.share({
				title: title,
				text: description,
				url: shareUrl,
			});
		} catch {
			console.error('공유 실패');
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />

			<div className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50">
				<div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full mx-auto animate-slide-up shadow-2xl">
					<div className="relative pt-6 pb-4 px-6">
						<div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

						<div className="flex items-center justify-between">
							<h2 className="text-[18px] font-bold text-gray-900">공유하기</h2>
							<button
								onClick={onClose}
								className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
							>
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					<div className="px-6 pb-6 space-y-4">
						<div
							className="relative rounded-2xl p-5 text-center border overflow-hidden"
							style={{
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
								borderColor: 'rgba(102, 126, 234, 0.2)',
							}}
						>
							<div className="text-4xl mb-2">{emoji}</div>
							<h3 className="text-[16px] font-bold text-gray-900 mb-1.5">{title}</h3>
							<p className="text-[13px] text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
						</div>

						<div className="space-y-2.5">
							<button
								onClick={handleCopyLink}
								className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
							>
								{copied ? (
									<>
										<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<span className="text-green-600">복사 완료!</span>
									</>
								) : (
									<>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
										<span>링크 복사</span>
									</>
								)}
							</button>

							{isMobile && (
								<button
									onClick={handleNativeShare}
									className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
								>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
										/>
									</svg>
									<span>다른 앱으로 공유</span>
								</button>
							)}
						</div>

						{!isMobile && (
							<div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
								<p className="text-[11px] font-medium text-gray-500 mb-1.5">공유 링크</p>
								<p className="text-[12px] text-gray-700 break-all font-mono">{shareUrl}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				@keyframes slide-up {
					from {
						transform: translateY(100%);
					}
					to {
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.2s ease-out;
				}
				.animate-slide-up {
					animation: slide-up 0.3s ease-out;
				}
			`}</style>
		</>
	);
}


import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
	return (
		<footer className="bg-gray-50 border-t border-gray-200">
			<div className="px-4 py-8">
				{/* 로고 및 설명 */}
				<div className="flex items-center mb-8">
					<Image src="/icons/logo.svg" alt="픽키드 로고" width={40} height={40} className="mr-3" />
					<div>
						<h3 className="text-lg font-bold text-gray-900">픽키드</h3>
						<p className="text-sm text-gray-600">나를 알아가는 재미있는 테스트 플랫폼</p>
					</div>
				</div>

				{/* 테스트 링크 */}
				<div className="mb-6">
					<h4 className="text-sm font-semibold text-gray-900 mb-3">다양한 테스트</h4>
					<div className="grid grid-cols-2 gap-2">
						<Link href="/tests/egen-teto" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
							에겐·테토 테스트
						</Link>
						<Link href="/tests/mbti" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
							MBTI 테스트
						</Link>
						<Link href="/tests/enneagram" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
							에니어그램
						</Link>
						<Link href="/tests/iq" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
							IQ 퀴즈
						</Link>
					</div>
				</div>

				{/* 저작권 */}
				<div className="border-t border-gray-200 pt-4 text-center">
					<p className="text-xs text-gray-500">© 2025 alstjr9438@gmail.com. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

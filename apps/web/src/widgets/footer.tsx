'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTestListVM } from '@/features/test/hooks';

export const Footer = () => {
	const { popularTests } = useTestListVM();

	return (
		<footer className="relative bg-gradient-to-b from-white via-purple-50/20 to-purple-100/30 border-t border-purple-100/50 backdrop-blur-sm">
			{/* 장식 요소 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl"></div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-12">
				{/* 상단 섹션 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
					{/* 브랜드 영역 */}
					<div className="md:col-span-4">
						<Link href="/" className="inline-flex items-center gap-2 mb-3">
							<Image src="/icons/logo.svg" alt="픽키드" width={28} height={28} />
							<span className="text-xl font-bold text-gray-900">픽키드</span>
						</Link>
						<p className="text-sm text-gray-600 leading-relaxed mb-6">나를 알아가는 심리 테스트 플랫폼</p>

						{/* 소셜 미디어 링크 */}
						<div className="flex gap-2">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
								aria-label="Instagram"
							>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>

							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
								aria-label="Twitter"
							>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>

							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
								aria-label="YouTube"
							>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
								</svg>
							</a>
						</div>
					</div>

					{/* 인기 테스트 */}
					<div className="md:col-span-4 md:col-start-7">
						<h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">인기 테스트</h4>
						<ul className="space-y-2">
							{popularTests.slice(0, 4).map((test) => (
								<li key={test.id}>
									<Link
										href={`/tests/${test.id}`}
										className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
									>
										{test.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* 하단 정보 */}
				<div className="border-t border-purple-200/50 pt-7 mt-2">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
						<div className="text-xs text-gray-500 space-y-1.5">
							<p className="font-medium text-gray-600">© 2025 픽키드(PickID). All rights reserved.</p>
							<p className="flex items-center gap-1.5">
								<span className="text-gray-400">Contact:</span>
								<Link href="mailto:alstjr9438@gmail.com" className="text-purple-600 font-medium">
									alstjr9438@gmail.com
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

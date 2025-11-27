'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
	return (
		<footer className="relative bg-gradient-to-b from-white via-sky-50/20 to-sky-100/30 border-t border-sky-100/50">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl"></div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
					<div>
						<Link href="/" className="inline-flex items-center gap-2 mb-3" prefetch={true}>
							<Image src="/icons/logo.svg" alt="픽키드" width={28} height={28} unoptimized />
						</Link>
						<p className="text-sm text-gray-600 leading-relaxed mb-6">나를 알아가는 테스트</p>


					</div>
				</div>

				<div className="border-t border-rose-200/50 pt-7 mt-2">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
						<div className="text-xs text-gray-500 space-y-1.5">
							<p className="font-medium text-gray-600">© 2025 픽키드(PickID). All rights reserved.</p>
							<p className="flex items-center gap-1.5">
								<span className="text-gray-400">Contact:</span>
								<Link href="mailto:alstjr9438@gmail.com" className="text-rose-600 font-medium">
									alstjr9438@gmail.com
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

'use client';

import Link from 'next/link';

export function Footer() {
	return (
		<footer className="relative bg-gradient-to-b from-white text-center via-sky-50/20 to-sky-100/30 ">
			<div className="mt-2 flex flex-col text-xs gap-1 items-center justify-center text-center">
				<p className="font-medium text-gray-600">© 2025 픽키드. All rights reserved.</p>
				<p className="flex items-center gap-1.5">
					<span className="text-gray-400">Contact:</span>
					<Link href="mailto:alstjr9438@gmail.com" className="text-rose-600 font-medium">
						alstjr9438@gmail.com
					</Link>
				</p>
			</div>
		</footer>
	);
}

export default Footer;

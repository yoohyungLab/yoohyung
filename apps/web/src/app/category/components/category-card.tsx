'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import type { Test } from '@pickid/supabase';

interface CategoryCardProps {
	test: Test;
}

export function CategoryCard({ test }: CategoryCardProps) {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push(`/tests/${test.id}`)}
			className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
		>
			{test.thumbnail_url && (
				<div className="relative w-full aspect-[4/3]">
					<Image
						src={test.thumbnail_url}
						alt={test.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform"
					/>
				</div>
			)}
			<div className="p-4">
				<h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{test.title}</h3>
				{test.description && <p className="text-xs text-gray-600 whitespace-pre-line line-clamp-2 mb-3">{test.description}</p>}
				{test.start_count && (
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<div className="flex items-center gap-1">
							<Eye className="w-3.5 h-3.5" />
							<span>{test.start_count.toLocaleString()}</span>
						</div>
					</div>
				)}
			</div>
		</button>
	);
}

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye } from 'lucide-react';

// 테스트 아이템 타입
export interface ITestItem {
	id: string;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	thumbnailUrl: string | null;
	created_at: string;
	category_ids?: string[] | null;
	completions?: number;
	starts?: number;
}

interface CategoryCardProps {
	test: ITestItem;
	className?: string;
}

/**
 * 개별 카테고리 테스트 카드 컴포넌트
 */
export function CategoryCard({ test, className }: CategoryCardProps) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/tests/${test.id}`);
	};

	return (
		<button
			onClick={handleClick}
			className={`group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all ${
				className || ''
			}`}
		>
			{test.thumbnailUrl && (
				<div className="relative w-full aspect-[4/3]">
					<Image
						src={test.thumbnailUrl}
						alt={test.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform"
					/>
				</div>
			)}
			<div className="p-4">
				<h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{test.title}</h3>
				{test.description && (
					<p className="text-xs text-gray-600 whitespace-pre-line line-clamp-2 mb-3">{test.description}</p>
				)}
				<div className="flex items-center gap-2 text-xs text-gray-500">
					{test.starts !== undefined && (
						<div className="flex items-center gap-1">
							<Eye className="w-3.5 h-3.5" />
							<span>{test.starts.toLocaleString()}</span>
						</div>
					)}
				</div>
			</div>
		</button>
	);
}

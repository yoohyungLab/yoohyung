'use client';

import { Card, CardContent, CardHeader } from '@pickid/ui';

interface ILoadingSkeletonProps {
	children?: React.ReactNode;
}

export function LoadingSkeleton({ children }: ILoadingSkeletonProps) {
	return (
		<Card
			className="relative overflow-hidden"
			style={{
				border: '1px solid rgba(0, 0, 0, 0.06)',
				boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
			}}
		>
			<CardHeader className="pb-4">
				<div className="animate-pulse">
					<div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{children || (
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, idx) => (
							<div key={idx} className="animate-pulse">
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-2 bg-gray-200 rounded mb-3"></div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

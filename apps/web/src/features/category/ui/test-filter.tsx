'use client';

import { DefaultSelect } from '@pickid/ui';

type SortOption = 'popular' | 'recent' | 'starts';

interface TestFilterProps {
	sortBy: SortOption;
	onSortChange: (sort: SortOption) => void;
	totalCount: number;
}

/**
 * 테스트 필터 컴포넌트
 * 정렬 옵션과 총 개수를 표시하는 컴포넌트
 */
export function TestFilter({ sortBy, onSortChange, totalCount }: TestFilterProps) {
	return (
		<div className="flex items-center justify-between mb-6">
			<div className="text-sm text-gray-600">총 {totalCount.toLocaleString()}개</div>
			<div className="w-40">
				<DefaultSelect
					value={sortBy}
					onValueChange={(v) => onSortChange(v as SortOption)}
					options={[
						{ value: 'popular', label: '인기순(완료)' },
						{ value: 'recent', label: '최신순' },
						{ value: 'starts', label: '시작순' },
					]}
					placeholder="정렬 선택"
					size="sm"
					variant="default"
				/>
			</div>
		</div>
	);
}

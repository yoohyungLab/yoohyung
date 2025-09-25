import { useCallback, useMemo, useState } from 'react';

interface UsePaginationOptions {
	defaultPage?: number;
	defaultPageSize?: number;
	totalItems: number;
}

export function usePagination({ defaultPage = 1, defaultPageSize = 10, totalItems }: UsePaginationOptions) {
	const [currentPage, setCurrentPageState] = useState(defaultPage);
	const [pageSize, setPageSizeState] = useState(defaultPageSize);

	// 총 페이지 수 계산
	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(totalItems / pageSize));
	}, [totalItems, pageSize]);

	// 페이지 변경 함수
	const setPage = useCallback(
		(page: number) => {
			const newPage = Math.max(1, Math.min(page, totalPages));
			setCurrentPageState(newPage);
		},
		[totalPages]
	);

	// 페이지 크기 변경 함수
	const setPageSize = useCallback((newPageSize: number) => {
		setPageSizeState(newPageSize);
		// 페이지 크기가 변경되면 첫 페이지로 이동
		setCurrentPageState(1);
	}, []);

	// 현재 페이지의 데이터 범위 계산
	const paginationInfo = useMemo(() => {
		const startItem = (currentPage - 1) * pageSize + 1;
		const endItem = Math.min(currentPage * pageSize, totalItems);

		return {
			startItem,
			endItem,
			hasNextPage: currentPage < totalPages,
			hasPreviousPage: currentPage > 1,
		};
	}, [currentPage, pageSize, totalItems, totalPages]);

	return {
		currentPage,
		pageSize,
		totalPages,
		totalItems,
		setPage,
		setPageSize,
		...paginationInfo,
	};
}

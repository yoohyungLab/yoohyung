'use client';

import { useCallback, useMemo, useState } from 'react';

interface UsePaginationOptions {
	defaultPage?: number;
	defaultPageSize?: number;
	totalItems: number;
}

export function usePagination({ defaultPage = 1, defaultPageSize = 10, totalItems }: UsePaginationOptions) {
	const [currentPage, setCurrentPageState] = useState(defaultPage);
	const [pageSize, setPageSizeState] = useState(defaultPageSize);

	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(totalItems / pageSize));
	}, [totalItems, pageSize]);

	const setPage = useCallback(
		(page: number) => {
			const newPage = Math.max(1, Math.min(page, totalPages));
			setCurrentPageState(newPage);
		},
		[totalPages]
	);

	const setPageSize = useCallback((newPageSize: number) => {
		setPageSizeState(newPageSize);
		setCurrentPageState(1);
	}, []);

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

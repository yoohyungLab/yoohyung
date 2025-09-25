import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from './pagination';

interface DefaultPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	showPageNumbers?: boolean;
	maxVisiblePages?: number;
}

export function DefaultPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
	showPageNumbers = true,
	maxVisiblePages = 5,
}: DefaultPaginationProps) {
	// 페이지 번호 배열 생성
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const half = Math.floor(maxVisiblePages / 2);

		if (totalPages <= maxVisiblePages) {
			// 전체 페이지가 표시할 페이지 수보다 적으면 모든 페이지 표시
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// 시작 페이지
			if (currentPage <= half + 1) {
				for (let i = 1; i <= maxVisiblePages - 1; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			}
			// 끝 페이지
			else if (currentPage >= totalPages - half) {
				pages.push(1);
				pages.push('...');
				for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
					pages.push(i);
				}
			}
			// 중간 페이지
			else {
				pages.push(1);
				pages.push('...');
				for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<Pagination className={cn('', className)}>
			<PaginationContent>
				{/* 이전 버튼 */}
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(currentPage - 1)}
						className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>

				{/* 페이지 번호들 */}
				{showPageNumbers &&
					pageNumbers.map((page, index) => (
						<PaginationItem key={index}>
							{page === '...' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									onClick={() => onPageChange(page as number)}
									isActive={currentPage === page}
									className="cursor-pointer"
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

				{/* 다음 버튼 */}
				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(currentPage + 1)}
						className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

import React from 'react';
import { Button } from './button';
import { cn } from '../lib/utils';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
    showInfo?: boolean;
    showPageNumbers?: boolean;
    maxVisiblePages?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    className,
    showInfo = true,
    showPageNumbers = true,
    maxVisiblePages = 5,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // Adjust if we're near the beginning or end
        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            } else {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Add visible pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={cn('px-4 py-3 border-t border-gray-200 flex items-center justify-between', className)}>
            {showInfo && (
                <div className="text-sm text-gray-500">
                    전체 {totalItems.toLocaleString()}개 중 {startItem}-{endItem}개 표시
                </div>
            )}

            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                    이전
                </Button>

                {showPageNumbers && (
                    <div className="flex items-center gap-1">
                        {getVisiblePages().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant={page === currentPage ? 'default' : 'outline'}
                                        onClick={() => onPageChange(page as number)}
                                        className={cn(
                                            'min-w-[32px] h-8',
                                            page === currentPage && 'bg-blue-600 hover:bg-blue-700 text-white'
                                        )}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                    다음
                </Button>
            </div>
        </div>
    );
}

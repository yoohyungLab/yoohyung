import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { ButtonProps, buttonVariants } from './button';

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
                pages.push(totalPages);``
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
        <div className={cn('flex items-center justify-center space-x-1', className)}>
            {/* 이전 버튼 */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={cn(
                    buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                    }),
                    'flex items-center gap-1 px-3 py-2',
                    currentPage <= 1 && 'opacity-50 cursor-not-allowed'
                )}
            >
                <ChevronLeft className="h-4 w-4" />
                이전
            </button>

            {/* 페이지 번호들 */}
            {showPageNumbers && (
                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={cn(
                                        buttonVariants({
                                            variant: currentPage === page ? 'default' : 'outline',
                                            size: 'sm',
                                        }),
                                        'px-3 py-2 min-w-[40px]'
                                    )}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* 다음 버튼 */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={cn(
                    buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                    }),
                    'flex items-center gap-1 px-3 py-2',
                    currentPage >= totalPages && 'opacity-50 cursor-not-allowed'
                )}
            >
                다음
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

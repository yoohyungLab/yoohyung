import React from 'react';
import { Card, Badge } from '@repo/ui';
import { cn } from '../../shared/lib/utils';

export interface StatCard {
    id: string;
    label: string;
    value: number | string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink' | 'gray';
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive';
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    style?: 'badge' | 'number'; // 새로운 스타일 옵션
}

export interface StatsCardsProps {
    stats: StatCard[];
    className?: string;
    columns?: 2 | 3 | 4 | 5 | 6;
    style?: 'badge' | 'number'; // 전체 스타일 기본값
}

const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
    gray: 'text-gray-600',
};

export function StatsCards({ stats, className, columns = 6, style = 'number' }: StatsCardsProps) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    };

    return (
        <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
            {stats.map((stat) => {
                const currentStyle = stat.style || style;

                return (
                    <Card key={stat.id} className="p-4">
                        {currentStyle === 'badge' ? (
                            // 뱃지 스타일 (피드백 페이지 스타일)
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">{stat.label}</div>
                                <Badge variant={stat.variant || 'default'} className="text-sm px-3 py-1">
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                </Badge>
                            </div>
                        ) : (
                            // 기존 숫자 스타일 (사용자 페이지 스타일)
                            <div className="text-center">
                                <div className={cn('text-lg font-semibold', colorClasses[stat.color || 'gray'])}>
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                </div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                                {stat.trend && (
                                    <div className={cn('text-xs mt-1', stat.trend.isPositive ? 'text-green-600' : 'text-red-600')}>
                                        {stat.trend.isPositive ? '+' : ''}
                                        {stat.trend.value}%
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}

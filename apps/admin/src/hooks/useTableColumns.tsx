import { useMemo } from 'react';
import { Badge, DefaultSelect, IconButton, type Column } from '@pickid/ui';
import { formatDate, formatDateLong, formatTime, formatNumber as formatNumberShared } from '@pickid/shared';
import { Calendar, Eye, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { TEST_STATUSES } from '@/constants';
import { toOptions } from '@/utils/options';

// 컬럼 타입 정의
export type TColumnType = 'text' | 'number' | 'date' | 'badge' | 'image' | 'custom' | 'actions';

// 뱃지 설정
export interface IBadgeConfig {
	getValue: (data: any) => string;
	getVariant?: (value: string) => 'success' | 'outline' | 'info' | 'destructive' | 'default';
	getLabel?: (value: string) => string;
}

// 이미지 설정
export interface IImageConfig {
	getValue: (data: any) => string;
	size?: 'sm' | 'md' | 'lg';
	fallback?: string;
}

// 액션 설정
export interface IActionConfig {
	type: 'view' | 'edit' | 'delete' | 'status' | 'reply' | 'custom';
	label?: string;
	onClick: (id: string, data?: any) => void | Promise<void>;
	condition?: (data: any) => boolean;
	statusOptions?: Array<{ value: string; label: string }>;
	icon?: React.ReactNode;
}

// 컬럼 설정 타입
export interface IColumnConfig<T = any> {
	id: string;
	header: string;
	type: TColumnType;

	// 공통 옵션
	accessor?: keyof T | ((data: T) => any);
	className?: string;
	sortable?: boolean;

	// 타입별 설정
	badge?: IBadgeConfig;
	image?: IImageConfig;
	actions?: IActionConfig[];

	// 커스텀 렌더링
	customRender?: (data: T) => React.ReactNode;

	// 포맷팅
	format?: (value: any) => string;
	prefix?: string;
	suffix?: string;

	// 날짜 포맷 옵션
	dateFormat?: 'short' | 'long' | 'time';
	showDateIcon?: boolean;

	// 텍스트 옵션
	maxLength?: number;
}

// 날짜 포맷팅 헬퍼
const formatDateValue = (
	date: string | Date | null | undefined,
	format: 'short' | 'long' | 'time' = 'short'
): string => {
	if (!date) return '-';

	switch (format) {
		case 'long':
			return formatDateLong(date);
		case 'time':
			return formatTime(date);
		default:
			return formatDate(date);
	}
};

// 숫자 포맷팅 (shared의 formatNumber 사용)
const formatNumberValue = formatNumberShared;

// 이미지 크기 매핑
const imageSizes = {
	sm: 'w-8 h-8',
	md: 'w-12 h-12',
	lg: 'w-16 h-16',
};

export function useTableColumns<T extends Record<string, any>>(configs: IColumnConfig<T>[]) {
	const columns: Column<T>[] = useMemo(() => {
		return configs.map((config) => {
			const baseColumn: Column<T> = {
				id: config.id,
				header: config.header,
				cell: ({ row }) => {
					const data = row.original;

					// 값 추출
					const getValue = () => {
						if (config.accessor) {
							return typeof config.accessor === 'function' ? config.accessor(data) : data[config.accessor];
						}
						return data[config.id];
					};

					// 타입별 렌더링
					switch (config.type) {
						case 'text': {
							const value = getValue();
							const formatted = config.format ? config.format(value) : String(value || '');
							const maxLength = config.maxLength || 50;
							const displayValue = formatted.length > maxLength ? `${formatted.substring(0, maxLength)}...` : formatted;

							return (
								<div className={config.className || 'text-sm text-gray-900'}>
									{config.prefix}
									{displayValue || '-'}
									{config.suffix}
								</div>
							);
						}

						case 'number': {
							const value = getValue();
							const formatted = config.format ? config.format(value) : formatNumberValue(value);

							return (
								<div className={config.className || 'text-sm text-gray-900 text-right'}>
									{config.prefix}
									{formatted}
									{config.suffix}
								</div>
							);
						}

						case 'date': {
							const value = getValue();
							const dateFormat = config.dateFormat || 'short';
							const formatted = config.format ? config.format(value) : formatDateValue(value, dateFormat);

							if (config.showDateIcon) {
								return (
									<div className={config.className || 'flex items-center gap-2'}>
										<Calendar className="w-4 h-4 text-gray-400" />
										<span className="text-sm text-gray-900">{formatted}</span>
									</div>
								);
							}

							return <div className={config.className || 'text-sm text-gray-900 whitespace-nowrap'}>{formatted}</div>;
						}

						case 'badge': {
							if (!config.badge) return null;

							const value = config.badge.getValue(data);
							const variant = config.badge.getVariant?.(value) || 'default';
							const label = config.badge.getLabel?.(value) || value;

							return (
								<Badge variant={variant} className={config.className || 'whitespace-nowrap'}>
									{label}
								</Badge>
							);
						}

						case 'image': {
							if (!config.image) return null;

							const src = config.image.getValue(data);
							const size = config.image.size || 'md';

							return (
								<img
									src={src || config.image.fallback}
									alt=""
									className={`${imageSizes[size]} rounded object-cover ${config.className || ''}`}
									onError={(e) => {
										if (config.image?.fallback) {
											e.currentTarget.src = config.image.fallback;
										}
									}}
								/>
							);
						}

						case 'actions': {
							if (!config.actions) return null;

							return (
								<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
									{config.actions.map((action, idx) => {
										if (action.condition && !action.condition(data)) {
											return null;
										}

										switch (action.type) {
											case 'view':
												return (
													<IconButton
														key={idx}
														size="sm"
														variant="outline"
														icon={<Eye className="w-4 h-4" />}
														aria-label="보기"
														onClick={() => action.onClick(data.id, data)}
													/>
												);
											case 'edit':
												return (
													<IconButton
														key={idx}
														size="sm"
														variant="outline"
														icon={<Pencil className="w-4 h-4" />}
														aria-label="수정"
														onClick={() => action.onClick(data.id, data)}
													/>
												);
											case 'delete':
												return (
													<IconButton
														key={idx}
														size="sm"
														variant="outline"
														icon={<Trash2 className="w-4 h-4" />}
														aria-label="삭제"
														onClick={() => action.onClick(data.id, data)}
														className="text-red-600 border-red-600 hover:bg-red-50"
													/>
												);
											case 'status': {
												const statusOptions = action.statusOptions || toOptions(TEST_STATUSES);
												return (
													<DefaultSelect
														key={idx}
														value={(data.status as string) || ''}
														onValueChange={(value: string) => action.onClick(data.id, { ...data, status: value })}
														options={statusOptions}
														size="sm"
														className="w-28 min-w-28 bg-white"
													/>
												);
											}
											case 'reply':
												return (
													<IconButton
														key={idx}
														size="sm"
														icon={<MessageSquare className="w-4 h-4" />}
														aria-label="답변"
														onClick={() => action.onClick(data.id, data)}
														className="bg-purple-600 hover:bg-purple-700 text-white"
													/>
												);
											case 'custom':
												return action.icon ? (
													<IconButton
														key={idx}
														size="sm"
														variant="outline"
														icon={action.icon}
														aria-label={action.label || '액션'}
														onClick={() => action.onClick(data.id, data)}
													/>
												) : null;
											default:
												return null;
										}
									})}
								</div>
							);
						}

						case 'custom': {
							return config.customRender?.(data) || null;
						}

						default:
							return <div>{String(getValue() || '-')}</div>;
					}
				},
			};

			return baseColumn;
		});
	}, [configs]);

	return { columns };
}

type ConfigItem = {
	value: string;
	label: string;
	[key: string]: any;
};

export function toOptions<T extends Record<string, ConfigItem>>(config: T): Array<{ value: string; label: string }> {
	return Object.values(config).map(({ value, label }) => ({ value, label }));
}

export function toFilterOptions<T extends Record<string, ConfigItem>>(
	config: T,
	allLabel: string = '전체'
): Array<{ value: string; label: string }> {
	return [{ value: 'all', label: allLabel }, ...toOptions(config)];
}

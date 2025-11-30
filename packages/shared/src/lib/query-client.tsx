'use client';

import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import React from 'react';

export function QueryClientProvider({ children }: React.PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: false,
						staleTime: 5 * 60 * 1000,
					},
				},
			})
	);

	return <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>;
}

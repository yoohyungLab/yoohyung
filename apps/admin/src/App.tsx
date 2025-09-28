import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './shared/lib/query-client';
import { AppRoutes } from './shared/config/routes';
import './App.css';

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<AppRoutes />
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

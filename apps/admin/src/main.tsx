import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@pickid/shared';
import './index.css';
import '@pickid/ui';
import App from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider>
			<App />
		</QueryClientProvider>
	</StrictMode>
);

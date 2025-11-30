import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	base: '/',
	plugins: [react()],
	css: {
		postcss: './postcss.config.js',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@pickid/ui': path.resolve(__dirname, '../../packages/ui/src'),
			'@pickid/shared': path.resolve(__dirname, '../../packages/shared/src'),
			'@pickid/supabase': path.resolve(__dirname, '../../packages/supabase/src'),
		},
	},
	server: {
		host: true,
		port: 5173,
	},
	build: {
		outDir: 'dist',
		chunkSizeWarningLimit: 1000,
	},
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: '/',
		plugins: [react()],
		css: {
			postcss: './postcss.config.js',
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@pickid/ui': path.resolve(__dirname, '../../packages/ui/src'),
			},
		},
		define: {
			'process.env': JSON.stringify(env),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		},
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
		},
	};
});

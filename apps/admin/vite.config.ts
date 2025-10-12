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
		server: {
			host: true, // 모든 네트워크 인터페이스에서 접근 가능
			port: 5173,
			hmr: {
				port: 5173, // HMR WebSocket 포트 명시적 설정
			},
		},
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
			rollupOptions: {
				external: ['@supabase/supabase-js'],
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							if (id.includes('react') || id.includes('react-dom')) {
								return 'vendor';
							}
							if (id.includes('@tanstack')) {
								return 'query';
							}
							if (id.includes('@supabase') || id.includes('@pickid/supabase')) {
								return 'supabase';
							}
							return 'vendor';
						}
					},
				},
			},
			chunkSizeWarningLimit: 1000,
		},
	};
});

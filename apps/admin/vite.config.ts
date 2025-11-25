import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	// 개발 환경에서 환경 변수 로드 확인 (디버깅용)
	if (mode === 'development') {
		console.log('[Vite Config] 환경 변수 로드 상태:', {
			hasViteSupabaseUrl: !!env.VITE_SUPABASE_URL,
			hasViteSupabaseKey: !!env.VITE_SUPABASE_ANON_KEY,
			viteUrlLength: env.VITE_SUPABASE_URL?.length || 0,
			viteKeyLength: env.VITE_SUPABASE_ANON_KEY?.length || 0,
			mode,
		});
	}

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
				'@pickid/shared': path.resolve(__dirname, '../../packages/shared/src'),
				'@pickid/supabase': path.resolve(__dirname, '../../packages/supabase/src'),
			},
		},
		define: {
			// 환경 변수를 명시적으로 정의 (Vite에서 process.env 접근 지원)
			'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
				env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''
			),
			'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
				env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
			),
			'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
			'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
			'process.env.SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(
				env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
			),
			'process.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode || 'development'),
		},
		server: {
			host: true, // 모든 네트워크 인터페이스에서 접근 가능
			port: 5173,
			// HMR 포트는 자동으로 할당 (서버 포트와 충돌 방지)
			// 또는 명시적으로 다른 포트 지정
			hmr: {
				// clientPort를 지정하지 않으면 서버 포트 사용
				// 문제 발생 시 아래 주석 해제하여 다른 포트 지정
				// clientPort: 5174,
			},
		},
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
			rollupOptions: {
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

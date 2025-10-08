import { supabase } from '@pickid/shared';
import type { AdminUser } from '@pickid/supabase';

export const adminAuthService = {
	// 관리자 로그인 (admin_users 테이블 사용)
	async login(email: string, password: string): Promise<AdminUser> {
		try {
			// admin_users 테이블에서 관리자 정보 조회
			const { data: adminData, error } = await supabase
				.from('admin_users')
				.select('*')
				.eq('email', email.toLowerCase())
				.eq('is_active', true)
				.single();

			if (error || !adminData) {
				throw new Error('관리자 계정을 찾을 수 없습니다.');
			}

			// 비밀번호 검증 (실제로는 bcrypt로 해시된 비밀번호를 비교해야 함)
			// 여기서는 간단히 string12#과 비교
			if (password !== 'string12#') {
				throw new Error('비밀번호가 올바르지 않습니다.');
			}

			// 로그인 성공 시 로컬 스토리지에 저장
			const adminUser: AdminUser = {
				id: adminData.id,
				email: adminData.email,
				name: adminData.name,
				username: adminData.username,
				password_hash: adminData.password_hash,
				is_active: adminData.is_active,
				created_at: adminData.created_at,
				updated_at: adminData.updated_at,
			};

			localStorage.setItem('adminUser', JSON.stringify(adminUser));
			localStorage.setItem('adminToken', 'admin-token-' + Date.now());

			return adminUser;
		} catch (err) {
			// Supabase 연결 오류인 경우 로컬 인증으로 폴백
			if (err instanceof Error && err.message.includes('Supabase configuration is missing')) {
				console.warn('Supabase not configured, using local authentication fallback');
				// 로컬 인증 로직 (개발 환경용)
				if (email === 'admin@pickid.com' && password === 'string12#') {
					const adminUser: AdminUser = {
						id: 'local-admin',
						email: 'admin@pickid.com',
						name: 'Local Admin',
						username: 'admin',
						password_hash: '',
						is_active: true,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					};

					localStorage.setItem('adminUser', JSON.stringify(adminUser));
					localStorage.setItem('adminToken', 'admin-token-' + Date.now());

					return adminUser;
				} else {
					throw new Error('관리자 계정을 찾을 수 없습니다.');
				}
			}
			throw err;
		}
	},

	// 로그아웃
	async logout() {
		localStorage.removeItem('adminUser');
		localStorage.removeItem('adminToken');
	},

	// 현재 로그인된 관리자 정보 조회 (로컬 스토리지 기반)
	async getCurrentAdmin(): Promise<AdminUser | null> {
		const adminUserStr = localStorage.getItem('adminUser');
		if (!adminUserStr) return null;

		try {
			const adminUser = JSON.parse(adminUserStr);
			// 토큰이 있는지 확인
			const token = localStorage.getItem('adminToken');
			if (!token) return null;

			return adminUser;
		} catch {
			return null;
		}
	},
};

import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
	email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
	password: z.string().min(1, '비밀번호를 입력해주세요').min(6, '비밀번호는 6자 이상이어야 합니다'),
});

// 회원가입 스키마
export const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, '닉네임 또는 이름을 입력해주세요')
			.min(2, '닉네임은 2자 이상이어야 합니다')
			.max(20, '닉네임은 20자 이하여야 합니다'),
		email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
		password: z
			.string()
			.min(1, '비밀번호를 입력해주세요')
			.min(6, '비밀번호는 6자 이상이어야 합니다')
			.max(100, '비밀번호는 100자 이하여야 합니다'),
		confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: '비밀번호가 일치하지 않습니다',
		path: ['confirmPassword'],
	});

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;










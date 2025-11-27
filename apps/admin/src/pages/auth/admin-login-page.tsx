import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { PATH } from '@/constants/routes';
import { AUTH_MESSAGES as AUTH } from '@pickid/shared';

export function AdminLoginPage() {
	const navigate = useNavigate();
	const { adminUser, login } = useAdminAuth();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 이미 로그인된 경우 메인으로 리다이렉트
	useEffect(() => {
		if (adminUser) {
			navigate(PATH.INDEX, { replace: true });
		}
	}, [adminUser, navigate]);

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (error) setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email.trim() || !formData.password.trim()) {
			setError(AUTH.REQUIRED_CREDENTIALS);
			return;
		}

		setIsSubmitting(true);
		setError(null);

		const result = await login(formData.email, formData.password);

		if (result.success) {
			// 로그인 성공 시 메인으로 이동
			setTimeout(() => {
				navigate(PATH.INDEX, { replace: true });
			}, 100);
		} else {
			setError(result.error || AUTH.LOGIN_FAILED);
			setIsSubmitting(false);
		}
	};

	// 개발 편의를 위한 auto-fill (프로덕션에서는 제거)
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			setFormData({
				email: 'admin@pickid.co.kr',
				password: 'string12#',
			});
		}
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* 로고/제목 */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 관리자 로그인</h1>
					<p className="text-gray-600">픽키드 관리자 페이지</p>
				</div>

				{/* 로그인 폼 */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* 이메일 입력 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder={AUTH.PLACEHOLDER_EMAIL}
									autoComplete="email"
									required
								/>
							</div>
						</div>

						{/* 비밀번호 입력 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={(e) => handleInputChange('password', e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder={AUTH.PLACEHOLDER_PASSWORD}
									autoComplete="current-password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>

						{/* 에러 메시지 */}
						{error && (
							<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
								<AlertCircle className="w-4 h-4" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						{/* 로그인 버튼 */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
									{AUTH.BUTTON_LOGGING_IN}
								</>
							) : (
								AUTH.BUTTON_LOGIN
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

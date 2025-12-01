import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ROUTES } from '@/constants/routes';
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

	useEffect(() => {
		if (adminUser) {
			navigate(ROUTES.home, { replace: true });
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
			setTimeout(() => {
				navigate(ROUTES.home, { replace: true });
			}, 100);
		} else {
			setError(result.error || AUTH.LOGIN_FAILED);
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			setFormData({
				email: 'admin@pickid.co.kr',
				password: 'string12#',
			});
		}
	}, []);

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-black mb-2">🔐 관리자 로그인</h1>
					<p className="text-gray-600">픽키드 관리자 페이지</p>
				</div>

				<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-black mb-2">이메일</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
									placeholder={AUTH.PLACEHOLDER_EMAIL}
									autoComplete="email"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-black mb-2">비밀번호</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={(e) => handleInputChange('password', e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
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

						{error && (
							<div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-300 rounded-lg text-black">
								<AlertCircle className="w-4 h-4" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

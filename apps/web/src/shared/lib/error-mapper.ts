// 에러 매핑 유틸리티

/**
 * Supabase Auth 에러를 사용자 친화적인 메시지로 변환
 */
export function mapAuthError(error: unknown): string {
	if (!error) return '알 수 없는 오류가 발생했습니다.';

	const errorMessage = typeof error === 'string' ? error : String(error);

	// Supabase Auth 에러 메시지 매핑
	const errorMap: Record<string, string> = {
		'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
		'Email not confirmed': '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
		'User already registered': '이미 가입된 이메일입니다.',
		'Password should be at least 6 characters': '비밀번호는 최소 6자 이상이어야 합니다.',
		'Signup requires a valid password': '유효한 비밀번호가 필요합니다.',
		'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
		'Database error saving new user': '사용자 정보 저장 중 오류가 발생했습니다.',
		'Auth session missing!': '인증 세션이 없습니다. 다시 로그인해주세요.',
		'Invalid refresh token': '세션이 만료되었습니다. 다시 로그인해주세요.',
		'Email rate limit exceeded': '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
		'For security purposes, an email was sent to you for confirmation': '보안을 위해 확인 이메일이 전송되었습니다.',
	};

	// 정확한 매칭
	if (errorMap[errorMessage]) {
		return errorMap[errorMessage];
	}

	// 부분 매칭
	for (const [key, value] of Object.entries(errorMap)) {
		if (errorMessage.includes(key)) {
			return value;
		}
	}

	// 기본 에러 메시지
	return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
}

/**
 * 일반적인 API 에러를 사용자 친화적인 메시지로 변환
 */
export function mapApiError(error: unknown): string {
	if (!error) return '알 수 없는 오류가 발생했습니다.';

	const errorMessage = typeof error === 'string' ? error : String(error);

	// 일반적인 API 에러 매핑
	const errorMap: Record<string, string> = {
		'Network Error': '네트워크 연결을 확인해주세요.',
		'Request failed with status code 404': '요청한 데이터를 찾을 수 없습니다.',
		'Request failed with status code 500': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		'Request failed with status code 403': '접근 권한이 없습니다.',
		'Request failed with status code 401': '인증이 필요합니다.',
		Timeout: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
	};

	// 정확한 매칭
	if (errorMap[errorMessage]) {
		return errorMap[errorMessage];
	}

	// 부분 매칭
	for (const [key, value] of Object.entries(errorMap)) {
		if (errorMessage.includes(key)) {
			return value;
		}
	}

	// 기본 에러 메시지
	return '요청 처리 중 오류가 발생했습니다.';
}

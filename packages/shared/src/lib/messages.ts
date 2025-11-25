/**
 * @file messages.ts
 * @description 공통 메시지 및 에러 핸들링
 * 반복되는 메시지만 상수화하고, 컨텍스트별 메시지는 인라인으로 작성
 */

// ===== 공통 메시지 (반복 사용) =====
export const COMMON_MESSAGES = {
	SUCCESS: '성공했습니다',
	FAILED: '실패했습니다',
	SAVED: '저장되었습니다',
	DELETED: '삭제되었습니다',
	UPDATED: '업데이트되었습니다',
	CREATED: '생성되었습니다',
	LOADING: '불러오는 중...',
	ERROR: '오류가 발생했습니다',
	NETWORK_ERROR: '네트워크 오류가 발생했습니다',
	UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
	CONFIRM_DELETE: '정말로 삭제하시겠습니까?',
	NO_DATA: '데이터가 없습니다',
	NO_RESULTS: '검색 결과가 없습니다',
} as const;

// ===== 인증 관련 =====
export const AUTH_MESSAGES = {
	LOGIN_FAILED: '로그인에 실패했습니다',
	LOGIN_ERROR: '로그인 중 오류가 발생했습니다',
	REQUIRED_CREDENTIALS: '아이디와 비밀번호를 모두 입력해주세요',
	UNAUTHORIZED: '로그인이 필요합니다',
	PLACEHOLDER_EMAIL: '이메일을 입력하세요',
	PLACEHOLDER_PASSWORD: '비밀번호를 입력하세요',
	BUTTON_LOGIN: '로그인',
	BUTTON_LOGOUT: '로그아웃',
	BUTTON_LOGGING_IN: '로그인 중...',
} as const;

// ===== 에러 메시지 매핑 =====

/**
 * Supabase Auth 에러를 사용자 친화적인 메시지로 변환
 */
export function mapAuthError(error: unknown): string {
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

	return mapError(error, errorMap, AUTH_MESSAGES.LOGIN_ERROR);
}

/**
 * 일반적인 API 에러를 사용자 친화적인 메시지로 변환
 */
export function mapApiError(error: unknown): string {
	const errorMap: Record<string, string> = {
		'Network Error': '네트워크 연결을 확인해주세요.',
		'Request failed with status code 404': '요청한 데이터를 찾을 수 없습니다.',
		'Request failed with status code 500': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		'Request failed with status code 403': '접근 권한이 없습니다.',
		'Request failed with status code 401': '인증이 필요합니다.',
		Timeout: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
	};

	return mapError(error, errorMap, COMMON_MESSAGES.ERROR);
}

/**
 * 에러를 에러 맵과 기본 메시지를 사용하여 사용자 친화적인 메시지로 변환하는 공통 함수
 */
function mapError(error: unknown, errorMap: Record<string, string>, defaultMessage: string): string {
	if (!error) return COMMON_MESSAGES.UNKNOWN_ERROR;

	const errorMessage = typeof error === 'string' ? error : String(error);

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

	return defaultMessage;
}

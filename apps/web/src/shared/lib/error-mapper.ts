/**
 * 에러 메시지를 한국어로 매핑하는 유틸 함수
 */

// 에러 코드/메시지 매핑 테이블
const ERROR_MAPPINGS = {
	// 인증 관련
	invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
	'invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
	user_not_found: '존재하지 않는 계정입니다.',
	'user not found': '존재하지 않는 계정입니다.',
	email_address_invalid: '올바른 이메일 주소를 입력해주세요.',
	invalid_email: '올바른 이메일 형식이 아닙니다.',
	'invalid email': '올바른 이메일 형식이 아닙니다.',
	password_too_short: '비밀번호는 6자 이상이어야 합니다.',
	'password too short': '비밀번호는 6자 이상이어야 합니다.',
	user_already_registered: '이미 가입된 이메일입니다.',
	'user already registered': '이미 가입된 이메일입니다.',
	email_not_confirmed: '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
	'email not confirmed': '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
	weak_password: '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.',
	'weak password': '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.',

	// OAuth 관련
	oauth_provider_error: '소셜 로그인 중 오류가 발생했습니다.',
	'oauth provider error': '소셜 로그인 중 오류가 발생했습니다.',
	kakao_auth_failed: '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
	'kakao auth failed': '카카오 로그인에 실패했습니다. 다시 시도해주세요.',

	// 네트워크 관련
	network_error: '네트워크 연결을 확인해주세요.',
	network: '네트워크 연결을 확인해주세요.',
	timeout: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
	connection_error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
	'connection error': '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',

	// 권한 관련
	unauthorized: '인증이 필요합니다. 다시 로그인해주세요.',
	forbidden: '접근 권한이 없습니다.',
	'not found': '요청한 정보를 찾을 수 없습니다.',
	access_denied: '접근이 거부되었습니다.',
	'access denied': '접근이 거부되었습니다.',

	// 일반적인 오류
	server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
	'server error': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
	internal_error: '내부 오류가 발생했습니다. 관리자에게 문의해주세요.',
	'internal error': '내부 오류가 발생했습니다. 관리자에게 문의해주세요.',
} as const;

/**
 * 에러를 한국어 메시지로 변환
 */
export function mapError(error: unknown): string {
	if (!error) {
		return '알 수 없는 오류가 발생했습니다.';
	}

	// Error 객체가 아닌 경우
	if (!(error instanceof Error)) {
		// 문자열인 경우
		if (typeof error === 'string') {
			return mapErrorMessage(error);
		}
		// 객체인 경우
		if (typeof error === 'object' && error !== null) {
			const errorObj = error as Record<string, unknown>;
			if (errorObj.message && typeof errorObj.message === 'string') {
				return mapErrorMessage(errorObj.message);
			}
			if (errorObj.error && typeof errorObj.error === 'string') {
				return mapErrorMessage(errorObj.error);
			}
		}
		return '알 수 없는 오류가 발생했습니다.';
	}

	return mapErrorMessage(error.message, (error as { code?: string })?.code);
}

/**
 * 에러 메시지를 매핑하는 내부 함수
 */
function mapErrorMessage(message: string, code?: string): string {
	const errorMessage = message.toLowerCase();
	const errorCode = code?.toLowerCase();

	// 에러 코드 우선 확인
	if (errorCode && ERROR_MAPPINGS[errorCode as keyof typeof ERROR_MAPPINGS]) {
		return ERROR_MAPPINGS[errorCode as keyof typeof ERROR_MAPPINGS];
	}

	// 에러 메시지 확인
	for (const [key, mappedMessage] of Object.entries(ERROR_MAPPINGS)) {
		if (errorMessage.includes(key)) {
			return mappedMessage;
		}
	}

	// 매핑되지 않은 경우 원본 메시지 반환 (한글이면 그대로, 영어면 기본 메시지)
	return message || '알 수 없는 오류가 발생했습니다.';
}

// 기존 함수들과의 호환성을 위한 별칭
export const mapAuthError = mapError;
export const mapGeneralError = mapError;

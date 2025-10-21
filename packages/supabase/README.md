# @pickid/supabase

Pickid 프로젝트의 Supabase 클라이언트 패키지입니다.

## 📦 설치

이 패키지는 monorepo 내부 패키지이며, 자동으로 workspace 링크됩니다.

```bash
# 패키지에서 사용
import { supabase } from '@pickid/supabase';
```

## 🔧 환경 변수 설정

### Next.js (Web 앱)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 서버에서만 사용
```

### Vite (Admin 앱)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 서버에서만 사용
```

## 📖 사용법

### 1. 클라이언트용 (브라우저)

브라우저에서 사용하며, 인증 세션을 자동으로 관리합니다.

```typescript
import { supabase } from '@pickid/supabase';

// 데이터 조회
const { data, error } = await supabase.from('tests').select('*').eq('status', 'published');

// 인증
await supabase.auth.signInWithPassword({
	email: 'user@example.com',
	password: 'password',
});
```

### 2. 서버용 (SSR/Server Components)

SSR이나 Server Component에서 사용하며, 세션을 저장하지 않습니다.

```typescript
import { createServerClient } from '@pickid/supabase';

export async function getTests() {
	const supabase = createServerClient();

	const { data, error } = await supabase.from('tests').select('*').eq('status', 'published');

	return data;
}
```

### 3. Admin용 (Service Role)

Service Role Key를 사용하여 RLS를 우회합니다. **절대 클라이언트에 노출 금지**

```typescript
import { createAdminClient } from '@pickid/supabase';

// 서버에서만 사용
export async function getAllUsers() {
	const supabase = createAdminClient();

	// RLS 우회하여 모든 데이터 조회
	const { data, error } = await supabase.from('users').select('*');

	return data;
}
```

## 🛡️ 보안 주의사항

1. **Service Role Key는 절대 클라이언트에 노출하지 마세요**
2. **createAdminClient()는 서버에서만 사용하세요**
3. **RLS(Row Level Security) 정책을 반드시 설정하세요**

## 📚 타입

타입도 함께 export 됩니다:

```typescript
import type {
	Database,
	Test,
	User,
	TestResult,
	Category,
	// ... 등등
} from '@pickid/supabase';
```

## 🏗️ 구조

```
packages/supabase/
├── src/
│   ├── index.ts           # 메인 export (클라이언트 생성)
│   ├── types/
│   │   ├── database.ts    # Supabase 자동 생성 타입
│   │   ├── admin.ts       # Admin 관련 타입
│   │   └── index.ts       # 타입 통합 export
│   ├── api/               # API 헬퍼 (선택)
│   ├── hooks/             # React hooks (선택)
│   └── lib/               # 유틸리티 함수
```

## 🔄 클라이언트 옵션

### 클라이언트용

- `persistSession: true` - 세션을 localStorage에 저장
- `autoRefreshToken: true` - 토큰 자동 갱신
- `detectSessionInUrl: true` - URL에서 세션 자동 감지

### 서버용

- `persistSession: false` - 세션 저장 안함
- `autoRefreshToken: false` - 토큰 갱신 안함

### Admin용

- `persistSession: false` - 세션 저장 안함
- `autoRefreshToken: false` - 토큰 갱신 안함
- Service Role Key 사용으로 RLS 우회

## 📝 참고

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

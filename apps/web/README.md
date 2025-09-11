.
├─ apps
│  ├─ fo/                     # Next.js(App Router)
│  │  ├─ src/
│  │  │  ├─ app/              # 라우팅(서버컴포넌트 중심)
│  │  │  ├─ pages?            # (필요시) api routes (pages/api 제외 권장)
│  │  │  ├─ entities/         # FSD
│  │  │  ├─ features/
│  │  │  ├─ widgets/
│  │  │  ├─ pages/            # (FSD의 pages 레이어; app/와 역할정의)
│  │  │  └─ shared/
│  │  └─ ... (env, next.config.mjs)
│  └─ bo/                     # Vite + React(백오피스)
│     ├─ src/
│     │  ├─ entities/         # FSD
│     │  ├─ features/
│     │  ├─ widgets/
│     │  ├─ pages/
│     │  └─ shared/
│     └─ ... (vite.config.ts)
│
├─ packages
│  ├─ ui/                     # 공용 UI(프레임워크-프리 React 컴포넌트)
│  ├─ shared/                 # 날짜/숫자/문자/폼 훅 등 순수 유틸
│  ├─ types/                  # Zod 스키마, DTO, enum, 타입
│  ├─ supabase/               # supabase client factory, repo 계층
│  ├─ config/                 # eslint/tailwind/tsconfig/vitest 공통
│  └─ icons/                  # (선택)
│
├─ turbo.json
├─ package.json               # pnpm workspaces
└─ tsconfig.base.json
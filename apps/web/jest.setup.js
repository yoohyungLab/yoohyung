import '@testing-library/jest-dom';

// Next.js의 Image 컴포넌트 모킹
jest.mock('next/image', () => ({
	__esModule: true,
	default: (props) => {
		// eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
		return <img {...props} />;
	},
}));

// Next.js의 useRouter 모킹
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
			back: jest.fn(),
			forward: jest.fn(),
			refresh: jest.fn(),
		};
	},
	useParams() {
		return {};
	},
	useSearchParams() {
		return new URLSearchParams();
	},
	usePathname() {
		return '/';
	},
}));

// Supabase 클라이언트 모킹
jest.mock('@pickid/supabase', () => ({
	supabase: {
		auth: {
			getUser: jest.fn(),
			signInWithPassword: jest.fn(),
			signOut: jest.fn(),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			delete: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			order: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			single: jest.fn(),
		})),
	},
}));

// TanStack Query 모킹
jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
	useMutation: jest.fn(),
	useQueryClient: jest.fn(),
	QueryClient: jest.fn(),
	QueryClientProvider: ({ children }) => children,
}));

// 전역 fetch 모킹
global.fetch = jest.fn();

// ResizeObserver 모킹
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// IntersectionObserver 모킹
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// @pickid/ui 패키지는 각 테스트 파일에서 개별적으로 모킹;

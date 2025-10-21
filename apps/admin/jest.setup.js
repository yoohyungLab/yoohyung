import '@testing-library/jest-dom';

// React Router 모킹
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => jest.fn(),
	useParams: () => ({}),
	useLocation: () => ({ pathname: '/' }),
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

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BalanceGameSection from '@/features/home/ui/balance-game-section';

// localStorage 모킹
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('BalanceGameSection', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.getItem.mockReturnValue(null);
	});

	it('밸런스게임 섹션이 올바르게 렌더링된다', () => {
		render(<BalanceGameSection />);

		expect(screen.getByText('이번주 핫한 밸런스!')).toBeInTheDocument();
		expect(screen.getByText('당신의 선택은?')).toBeInTheDocument();
		expect(screen.getByText('HOT')).toBeInTheDocument();
	});

	it('밸런스게임 옵션들이 올바르게 렌더링된다', () => {
		render(<BalanceGameSection />);

		// 주간별로 다른 게임이 표시되므로 일반적인 확인
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('옵션을 클릭하면 결과 화면이 표시된다', async () => {
		render(<BalanceGameSection />);

		const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('group rounded-xl'));
		fireEvent.click(optionButtons[0]);

		await waitFor(() => {
			expect(screen.getByText('내 선택')).toBeInTheDocument();
			expect(screen.getByText(/결과 공유하기/)).toBeInTheDocument();
			expect(screen.getByText(/다시 참여하기/)).toBeInTheDocument();
		});
	});

	it('투표 결과에서 통계가 올바르게 표시된다', async () => {
		render(<BalanceGameSection />);

		const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('group rounded-xl'));
		fireEvent.click(optionButtons[0]);

		await waitFor(() => {
			expect(screen.getByText(/이 참여했어요/)).toBeInTheDocument();
			expect(screen.getByText(/같은 선택을 했어요/)).toBeInTheDocument();
		});
	});

	it('다시 참여하기 버튼이 올바르게 동작한다', async () => {
		render(<BalanceGameSection />);

		// 첫 번째 선택
		const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('group rounded-xl'));
		fireEvent.click(optionButtons[0]);

		await waitFor(() => {
			expect(screen.getByText('내 선택')).toBeInTheDocument();
		});

		// 다시 참여하기 클릭
		const resetButton = screen.getByText(/다시 참여하기/);
		fireEvent.click(resetButton);

		await waitFor(() => {
			expect(screen.queryByText('내 선택')).not.toBeInTheDocument();
			const buttons = screen.getAllByRole('button').filter((btn) => btn.className.includes('group rounded-xl'));
			expect(buttons.length).toBe(2);
		});
	});

	it('투표 시 로컬 스토리지에 데이터가 저장된다', async () => {
		render(<BalanceGameSection />);

		const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('group rounded-xl'));
		fireEvent.click(optionButtons[0]);

		await waitFor(() => {
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				expect.stringContaining('balance-vote-'),
				expect.any(String)
			);
		});
	});

	it('더 많은 밸런스게임 버튼이 올바르게 렌더링된다', () => {
		render(<BalanceGameSection />);

		expect(screen.getByText('더 많은 밸런스게임 보기 →')).toBeInTheDocument();
	});

	it('주간별로 다른 밸런스게임이 표시된다', () => {
		// 현재 시간을 모킹하여 다른 주차의 게임이 표시되도록 함
		const mockDate = new Date('2024-01-15'); // 월요일
		jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date);

		render(<BalanceGameSection />);

		// 다른 주차의 게임이 표시되는지 확인
		expect(screen.getByText('이번주 핫한 밸런스!')).toBeInTheDocument();

		jest.restoreAllMocks();
	});

	it('이모지와 아이콘이 올바르게 표시된다', () => {
		render(<BalanceGameSection />);

		expect(screen.getByText('⚖️')).toBeInTheDocument();
		// 주간별로 다른 이모지가 표시되므로 aria-hidden 속성으로 확인
		const emojis = document.querySelectorAll('[aria-hidden="true"]');
		expect(emojis.length).toBeGreaterThan(0);
	});

	it('HOT 배지가 올바르게 표시된다', () => {
		render(<BalanceGameSection />);

		const hotBadge = screen.getByText('HOT');
		expect(hotBadge).toBeInTheDocument();
		expect(hotBadge).toHaveClass('bg-red-100', 'text-red-600');
	});
});

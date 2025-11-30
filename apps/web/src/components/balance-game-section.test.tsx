import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BalanceGameSection from '@/components/balance-game-section';
import { useHomeBalanceGame } from '@/hooks';

// useHomeBalanceGame 훅을 모킹합니다.
jest.mock('@/hooks/useHomeBalanceGame');

const mockUseHomeBalanceGame = useHomeBalanceGame as jest.Mock;

describe('BalanceGameSection', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('로딩 상태가 올바르게 렌더링된다', () => {
		mockUseHomeBalanceGame.mockReturnValue({
			isLoading: true,
		});

		const { container } = render(<BalanceGameSection />);
		// 스켈레톤 UI의 일부인 animate-pulse 클래스를 가진 요소가 있는지 확인
		expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
	});

	it('게임 데이터가 없으면 아무것도 렌더링하지 않는다', () => {
		mockUseHomeBalanceGame.mockReturnValue({
			isLoading: false,
			game: null,
		});

		const { container } = render(<BalanceGameSection />);
		expect(container).toBeEmptyDOMElement();
	});

	describe('게임 데이터가 있을 때', () => {
		const mockGame = {
			id: 'test-game-id',
			title: '짜장면 vs 짬뽕',
			options: [
				{ id: 'A', label: '짜장면', emoji: '🍜', votes: 5, percentage: 50 },
				{ id: 'B', label: '짬뽕', emoji: '🌶️', votes: 5, percentage: 50 },
			],
			totalVotes: 10,
		};

		it('투표 전 화면이 올바르게 렌더링된다', () => {
			mockUseHomeBalanceGame.mockReturnValue({
				isLoading: false,
				isVoting: false,
				userChoice: null,
				game: mockGame,
				vote: jest.fn(),
				resetVote: jest.fn(),
			});

			render(<BalanceGameSection />);
			expect(screen.getByRole('heading')).toHaveTextContent('짜장면 vs 짬뽕');
			expect(screen.getByText('짜장면')).toBeInTheDocument();
			expect(screen.getByText('짬뽕')).toBeInTheDocument();
			expect(screen.getByText('10명이 참여했어요!')).toBeInTheDocument();
		});

		it('옵션을 클릭하면 vote 함수가 호출된다', () => {
			const voteMock = jest.fn();
			mockUseHomeBalanceGame.mockReturnValue({
				isLoading: false,
				isVoting: false,
				userChoice: null,
				game: mockGame,
				vote: voteMock,
				resetVote: jest.fn(),
			});

			render(<BalanceGameSection />);
			const optionA = screen.getByText('짜장면');
			fireEvent.click(optionA);

			expect(voteMock).toHaveBeenCalledWith('A');
		});

		it('투표 후 결과 화면이 올바르게 렌더링된다', () => {
			mockUseHomeBalanceGame.mockReturnValue({
				isLoading: false,
				isVoting: false,
				userChoice: 'A', // 사용자가 A를 선택했다고 가정
				game: {
					...mockGame,
					options: [
						{ id: 'A', label: '짜장면', emoji: '🍜', votes: 6, percentage: 55 },
						{ id: 'B', label: '짬뽕', emoji: '🌶️', votes: 5, percentage: 45 },
					],
					totalVotes: 11,
				},
				vote: jest.fn(),
				resetVote: jest.fn(),
			});

			render(<BalanceGameSection />);
			expect(screen.getByText('내 선택')).toBeInTheDocument();
			expect(screen.getByText('55%')).toBeInTheDocument();
			expect(screen.getByText('(6명)')).toBeInTheDocument();
			expect(screen.getByText('45%')).toBeInTheDocument();
			expect(screen.getByText('(5명)')).toBeInTheDocument();
			expect(screen.getByText('다시 투표하기')).toBeInTheDocument();
		});

		it('다시 투표하기 버튼을 클릭하면 resetVote 함수가 호출된다', () => {
			const resetVoteMock = jest.fn();
			mockUseHomeBalanceGame.mockReturnValue({
				isLoading: false,
				isVoting: false,
				userChoice: 'A',
				game: mockGame,
				vote: jest.fn(),
				resetVote: resetVoteMock,
			});

			render(<BalanceGameSection />);
			const resetButton = screen.getByText('다시 투표하기');
			fireEvent.click(resetButton);

			expect(resetVoteMock).toHaveBeenCalledTimes(1);
		});
	});
});
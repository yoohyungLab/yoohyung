import type { HomeBalanceGame } from '@pickid/supabase';
import { supabase } from '@pickid/supabase';

export const getHomeBalanceGame = async (): Promise<HomeBalanceGame> => {
	const { data, error } = await supabase
		.from('home_balance_games')
		.select('*')
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		// .limit(1)
		.single();

	if (error) {
		console.error('Error fetching home balance game:', error);
		throw new Error('밸런스 게임 데이터를 불러오는 데 실패했습니다.');
	}

	return data;
};

export const voteHomeBalanceGame = async (
	gameId: string,
	choice: 'A' | 'B'
): Promise<Pick<HomeBalanceGame, 'id' | 'votes_a' | 'votes_b' | 'total_votes'>> => {
	const { data, error } = await supabase.rpc('increment_balance_game_vote', {
		p_game_id: gameId,
		p_choice: choice,
	});

	if (error) {
		console.error('Error in vote RPC:', error);
		throw new Error('투표 처리 중 오류가 발생했습니다.');
	}

	if (!data || data.length === 0) {
		throw new Error('투표 후 데이터를 반환받지 못했습니다.');
	}

	const result = data[0];

	return {
		id: result.return_id,
		votes_a: result.return_votes_a,
		votes_b: result.return_votes_b,
		total_votes: result.return_total_votes,
	};
};

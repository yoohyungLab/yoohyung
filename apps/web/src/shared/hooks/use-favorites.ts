'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@repo/shared';
import { useAuth } from '@/shared/lib/auth';

interface FavoriteContentId {
	content_id: string;
}

export function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;

		const fetchFavorites = async () => {
			setLoading(true);
			const { data, error } = await supabase.from('favorites').select('content_id').eq('user_id', user.id);

			if (!error && data) {
				setFavoriteIds(data.map((row: FavoriteContentId) => row.content_id));
			}
			setLoading(false);
		};

		fetchFavorites();
	}, [user]);

	const toggleFavorite = async (id: string) => {
		if (!user) return;
		const isExist = favoriteIds.includes(id);

		if (isExist) {
			const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('content_id', id);

			if (!error) {
				setFavoriteIds((prev) => prev.filter((f) => f !== id));
			}
		} else {
			const { error } = await supabase.from('favorites').insert([{ user_id: user.id, content_id: id }]);
			if (!error) {
				setFavoriteIds((prev) => [...prev, id]);
			}
		}
	};

	const isFavorite = (id: string) => favoriteIds.includes(id);

	return {
		favoriteIds,
		loading,
		toggleFavorite,
		isFavorite,
		// 기존 호환성을 위한 별칭
		favorites: favoriteIds,
	};
}

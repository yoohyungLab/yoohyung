'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@pickid/supabase';
import { useAuthVM } from '@/features/auth/hooks';

// 즐겨찾기 콘텐츠 ID - Supabase favorites 테이블 기반
interface FavoriteContentId {
	content_id: string;
}

export function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	// useAuth를 안전하게 사용 (SSR 대응)
	let user = null;
	try {
		const auth = useAuthVM();
		user = auth.user;
	} catch {
		// SessionProvider 밖에서 사용되는 경우 (SSR 등)
		user = null;
	}

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

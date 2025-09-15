import { supabase } from '@repo/shared';

// OAuth 로그인 함수들
export const signInWithKakao = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('카카오 로그인 실패:', error);
        return { data: null, error };
    }
};

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('구글 로그인 실패:', error);
        return { data: null, error };
    }
};

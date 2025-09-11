'use client';

import { create } from 'zustand';
import { supabase } from '@repo/shared';

interface User {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    provider?: 'kakao' | 'google' | 'email';
}

interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: (provider: 'kakao' | 'google' | 'email', credentials?: { email: string; password: string }) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    loading: true,

    signIn: async (provider, credentials) => {
        try {
            set({ loading: true });

            if (provider === 'kakao') {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'kakao',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
            } else if (provider === 'google') {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
            } else if (provider === 'email' && credentials) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;

                if (data.user) {
                    // 삭제된 사용자 체크
                    if (data.user.user_metadata?.deleted_at) {
                        await supabase.auth.signOut();
                        throw new Error('탈퇴한 계정입니다. 새로운 계정으로 가입해주세요.');
                    }

                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

                    if (profile && (profile.status === 'deleted' || profile.deleted_at)) {
                        await supabase.auth.signOut();
                        throw new Error('탈퇴된 계정입니다. 새로운 계정으로 가입해주세요.');
                    }

                    // 프로필이 없으면 생성
                    if (!profile) {
                        await supabase.from('profiles').upsert({
                            id: data.user.id,
                            email: data.user.email,
                            name:
                                data.user.user_metadata?.name ||
                                data.user.user_metadata?.full_name ||
                                data.user.email?.split('@')[0] ||
                                '사용자',
                            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                            provider: (data.user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                            created_at: new Date().toISOString(),
                        });
                    }

                    const userWithProfile = {
                        ...data.user,
                        name:
                            profile?.name ||
                            data.user.user_metadata?.name ||
                            data.user.user_metadata?.full_name ||
                            data.user.email?.split('@')[0] ||
                            '사용자',
                        avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                        provider: ((profile?.provider || data.user.app_metadata?.provider) as 'kakao' | 'google' | 'email') || 'email',
                    };
                    set({ user: userWithProfile });
                }
            }
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signUp: async (email, password, name) => {
        try {
            set({ loading: true });
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            });
            if (error) throw error;
            if (data.user) {
                set({ user: data.user });
            }
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null });
        } catch (error) {
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            set({ loading: true });
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // 삭제된 사용자 체크
                if (user.user_metadata?.deleted_at) {
                    await supabase.auth.signOut();
                    set({ user: null });
                    return;
                }

                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

                if (profile?.deleted_at) {
                    await supabase.auth.signOut();
                    set({ user: null });
                    return;
                }

                // 프로필이 없으면 생성
                let finalProfile = profile;
                if (!profile) {
                    const { data: newProfile } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            email: user.email,
                            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
                            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                            provider: (user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                            created_at: new Date().toISOString(),
                        })
                        .select()
                        .single();

                    finalProfile = newProfile;
                }

                const userWithProfile = {
                    ...user,
                    name:
                        finalProfile?.name ||
                        user.user_metadata?.name ||
                        user.user_metadata?.full_name ||
                        user.email?.split('@')[0] ||
                        '사용자',
                    avatar_url: finalProfile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
                    provider: ((finalProfile?.provider || user.app_metadata?.provider) as 'kakao' | 'google' | 'email') || 'email',
                };
                set({ user: userWithProfile });
            } else {
                set({ user: null });
            }
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));

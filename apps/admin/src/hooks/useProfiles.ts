import { useState, useCallback } from 'react';
import { profileService } from '../api/profile.service';
import type { Profile, ProfileFilters } from '../api/profile.service';

export const useProfiles = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchProfiles = useCallback(async (filters?: ProfileFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await profileService.getProfiles(filters);
            setProfiles(response.profiles);
            setTotal(response.total);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자를 불러오는데 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProfile = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileService.getProfile(id);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfileStatus = useCallback(async (id: string, status: Profile['status']) => {
        try {
            setLoading(true);
            setError(null);
            const updatedProfile = await profileService.updateProfileStatus(id, status);
            setProfiles((prev) => prev.map((profile) => (profile.id === id ? updatedProfile : profile)));
            return updatedProfile;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자 상태 수정에 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkUpdateStatus = useCallback(async (ids: string[], status: Profile['status']) => {
        try {
            setLoading(true);
            setError(null);
            await profileService.bulkUpdateStatus(ids, status);
            setProfiles((prev) => prev.map((profile) => (ids.includes(profile.id) ? { ...profile, status } : profile)));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자 일괄 수정에 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProfileStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const stats = await profileService.getProfileStats();
            return stats;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자 통계를 불러오는데 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProfileActivity = useCallback(async (profileId: string) => {
        try {
            setLoading(true);
            setError(null);
            const activity = await profileService.getProfileActivity(profileId);
            return activity;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '사용자 활동을 불러오는데 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        profiles,
        loading,
        error,
        total,
        fetchProfiles,
        fetchProfile,
        updateProfileStatus,
        bulkUpdateStatus,
        getProfileStats,
        getProfileActivity,
        clearError,
    };
};

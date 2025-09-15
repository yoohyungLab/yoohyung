import React, { useCallback, useEffect, useState, useMemo, startTransition } from 'react';
import { usePagination } from '@repo/shared';
import { profileService, type Profile, type ProfileFilters, type ProfileWithActivity } from '../../api/profile.service';
import { DataTable, type Column, DefaultPagination } from '@repo/ui';
import { ProfileDetailModal } from '@/components/user';
import { AdminCard, BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { useColumnRenderers } from '@/shared/hooks';
import { FILTER_PROVIDER_OPTIONS, FILTER_STATUS_OPTIONS, PAGINATION } from '@/shared/lib/constants';

export function UserListPage() {
    const renderers = useColumnRenderers();

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalProfile, setModalProfile] = useState<ProfileWithActivity | null>(null);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [totalProfiles, setTotalProfiles] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        provider: 'all',
    });
    const pagination = usePagination({
        totalItems: totalProfiles,
        defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    // 간단한 통계 (필요한 것만)
    const [stats, setStats] = useState({ active: 0, inactive: 0, deleted: 0 });

    // 모든 데이터를 한번에 로딩
    const loadData = useCallback(
        async (includeStats = false) => {
            setLoading(true);
            setError(null);

            try {
                const apiFilters: ProfileFilters = {
                    search: filters.search || undefined,
                    status: filters.status !== 'all' ? (filters.status as Profile['status']) : undefined,
                    provider: filters.provider !== 'all' ? (filters.provider as 'email' | 'google' | 'kakao') : undefined,
                };

                // 프로필 데이터 로딩
                const profileResult = await profileService.getProfiles(apiFilters, pagination.currentPage, pagination.pageSize);
                setProfiles(profileResult.profiles);
                setTotalProfiles(profileResult.total);

                // 통계 데이터 로딩
                if (includeStats) {
                    const statsResult = await profileService.getProfileStats();
                    setStats({
                        active: statsResult.active,
                        inactive: statsResult.inactive,
                        deleted: statsResult.deleted,
                    });
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        },
        [filters, pagination.currentPage, pagination.pageSize]
    );

    // 필터 변경 시 첫 페이지로 이동하고 데이터 로딩
    useEffect(() => {
        startTransition(() => {
            pagination.setPage(1);
            loadData(true); // 필터 변경 시에는 통계도 함께 로딩
        });
    }, [filters.search, filters.status, filters.provider, pagination.setPage, loadData]);

    // 페이지 변경 시 데이터 로딩
    useEffect(() => {
        loadData(false);
    }, [loadData, pagination.currentPage, pagination.pageSize]);

    // 개별 사용자 상태 변경 - 서버 요청 후 즉시 UI 업데이트
    const handleStatusChange = useCallback(
        async (profileId: string, newStatus: Profile['status']) => {
            try {
                await profileService.updateProfileStatus(profileId, newStatus);
                // 상태 변경 후 즉시 UI 업데이트
                setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, status: newStatus } : p)));
                // 통계도 즉시 업데이트
                setStats((prev) => ({
                    ...prev,
                    [newStatus]: prev[newStatus] + 1,
                    [profiles.find((p) => p.id === profileId)?.status || 'active']:
                        prev[profiles.find((p) => p.id === profileId)?.status || 'active'] - 1,
                }));
            } catch (error) {
                console.error('상태 변경 실패:', error);
            }
        },
        [profiles]
    );

    // 대량 상태 변경 - 선택된 여러 사용자 상태를 한번에 변경
    const handleBulkStatusChange = async (status: Profile['status']) => {
        if (selectedProfiles.length === 0) return;

        try {
            await profileService.bulkUpdateStatus(selectedProfiles, status);
            setSelectedProfiles([]);
            loadData(true); // 통계도 함께 새로고침
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    // 사용자 탈퇴 처리 - 확인 후 삭제하고 목록 새로고침
    const handleDeleteProfile = useCallback(
        async (profileId: string) => {
            if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;

            try {
                await profileService.deleteProfile(profileId);
                loadData(true); // 통계도 함께 새로고침
            } catch (error) {
                console.error('탈퇴 처리 실패:', error);
            }
        },
        [loadData]
    );

    // Table columns definition (memoized for performance)
    const columns: Column<Profile>[] = useMemo(
        () => [
            {
                id: 'email',
                header: '이메일',
                accessorKey: 'email',
                cell: ({ row }) => renderers.renderEmail(row.original.email),
            },
            {
                id: 'name',
                header: '이름',
                cell: ({ row }) => renderers.renderNameWithAvatar(row.original.name, row.original.avatar_url),
            },
            {
                id: 'provider',
                header: '가입경로',
                cell: ({ row }) => renderers.renderProvider(row.original.provider),
            },
            {
                id: 'status',
                header: '상태',
                cell: ({ row }) => renderers.renderStatus(row.original.status),
            },
            {
                id: 'created_at',
                header: '가입일',
                cell: ({ row }) => renderers.renderDate(row.original.created_at),
            },
            {
                id: 'actions',
                header: '액션',
                cell: ({ row }) =>
                    renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
                        {
                            type: 'status',
                            onClick: (id, data) => handleStatusChange(id, (data?.status as Profile['status']) || 'active'),
                        },
                        {
                            type: 'delete',
                            onClick: (id) => handleDeleteProfile(id),
                        },
                    ]),
            },
        ],
        [renderers, handleStatusChange, handleDeleteProfile]
    );

    // TODO: CSV 내보내기 기능 구현 예정
    // const handleExportProfiles = async () => {
    //     // CSV 내보내기 로직 구현
    // };

    return (
        <div className="space-y-6 p-5">
            {/* 간단한 통계 */}
            <StatsCards
                stats={[
                    { id: 'active', label: '활성 사용자', value: stats.active, variant: 'success' },
                    { id: 'inactive', label: '비활성', value: stats.inactive, variant: 'warning' },
                    { id: 'deleted', label: '탈퇴', value: stats.deleted, variant: 'destructive' },
                ]}
                columns={3}
                style="badge"
            />

            {/* Search & Filters */}
            <AdminCard>
                <FilterBar
                    commonFilters={{
                        search: {
                            placeholder: '이메일 또는 이름으로 검색',
                        },
                        status: {
                            options: FILTER_STATUS_OPTIONS,
                        },
                        provider: {
                            options: FILTER_PROVIDER_OPTIONS,
                        },
                    }}
                    onFilterChange={(newFilters) => {
                        setFilters({
                            search: newFilters.search || '',
                            status: newFilters.status || 'all',
                            provider: newFilters.provider || 'all',
                        });
                    }}
                />
            </AdminCard>

            {/* Bulk Actions */}
            <BulkActions
                selectedCount={selectedProfiles.length}
                actions={[
                    {
                        id: 'activate',
                        label: '활성화',
                        onClick: () => handleBulkStatusChange('active'),
                    },
                    {
                        id: 'deactivate',
                        label: '비활성화',
                        onClick: () => handleBulkStatusChange('inactive'),
                    },
                    {
                        id: 'delete',
                        label: '탈퇴 처리',
                        variant: 'destructive',
                        onClick: () => handleBulkStatusChange('deleted'),
                    },
                ]}
                onClear={() => setSelectedProfiles([])}
            />

            {/* User List */}
            <DataState loading={loading} error={error} data={profiles} onRetry={() => loadData(true)}>
                <DataTable
                    data={profiles}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedProfiles}
                    onSelectionChange={setSelectedProfiles}
                    getRowId={(profile: Profile) => profile.id}
                    totalCount={totalProfiles}
                    totalLabel="사용자"
                    onRowClick={(profile: Profile) => {
                        setModalProfile(profile as ProfileWithActivity);
                    }}
                />
            </DataState>

            {/* Pagination */}
            <DefaultPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                className="mt-6"
            />

            {/* Profile Detail Modal */}
            {modalProfile && <ProfileDetailModal profile={modalProfile} onClose={() => setModalProfile(null)} />}
        </div>
    );
}

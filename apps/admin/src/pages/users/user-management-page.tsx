import React, { useCallback, useEffect, useState } from 'react';
import { usePagination } from '@repo/shared';
import { profileService, type Profile, type ProfileFilters, type ProfileWithActivity } from '@repo/supabase';
import { DataTable, type Column } from '@repo/ui';
import { ProfileDetailModal } from '../../components/user';
import { AdminCard, BulkActions, DataState, FilterBar } from '../../components/ui';
import { useColumnRenderers } from '../../shared/hooks';
import { PAGINATION } from '../../shared/lib';

export function UserManagementPage() {
    const renderers = useColumnRenderers();

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalProfile, setModalProfile] = useState<ProfileWithActivity | null>(null);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        provider: 'all',
    });
    const [totalProfiles, setTotalProfiles] = useState(0);
    const pagination = usePagination({
        totalItems: totalProfiles,
        defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    // 간단한 통계 (필요한 것만)
    const [stats, setStats] = useState({ active: 0, inactive: 0, deleted: 0 });

    // API calls
    const loadProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const apiFilters: ProfileFilters = {
                search: filters.search || undefined,
                status: filters.status !== 'all' ? (filters.status as Profile['status']) : undefined,
                provider: filters.provider !== 'all' ? (filters.provider as 'email' | 'google' | 'kakao') : undefined,
            };

            const data = await profileService.getProfiles(apiFilters, pagination.currentPage, pagination.pageSize);
            setProfiles(data.profiles);
            setTotalProfiles(data.total);
        } catch (error) {
            console.error('프로필 목록 로딩 실패:', error);
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.currentPage, pagination.pageSize]);

    const loadStats = useCallback(async () => {
        try {
            const statsData = await profileService.getProfileStats();
            setStats({
                active: statsData.active,
                inactive: statsData.inactive,
                deleted: statsData.deleted,
            });
        } catch (error) {
            console.error('통계 로딩 실패:', error);
        }
    }, []);

    // 필터 변경 시 첫 페이지로 이동하고 데이터 로딩
    useEffect(() => {
        if (pagination.currentPage !== 1) {
            pagination.setPage(1);
        } else {
            loadProfiles();
            loadStats();
        }
    }, [filters.search, filters.status, filters.provider, loadProfiles, loadStats, pagination]);

    // 페이지 변경 시에만 프로필 로딩
    useEffect(() => {
        loadProfiles();
    }, [pagination.currentPage, pagination.pageSize, loadProfiles]);

    // 개별 사용자 상태 변경 - 서버 요청 후 즉시 UI 업데이트
    const handleStatusChange = async (profileId: string, newStatus: Profile['status']) => {
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
    };

    // 대량 상태 변경 - 선택된 여러 사용자 상태를 한번에 변경
    const handleBulkStatusChange = async (status: Profile['status']) => {
        if (selectedProfiles.length === 0) return;

        try {
            await profileService.bulkUpdateStatus(selectedProfiles, status);
            setSelectedProfiles([]);
            loadProfiles();
            loadStats();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    // 사용자 탈퇴 처리 - 확인 후 삭제하고 목록 새로고침
    const handleDeleteProfile = async (profileId: string) => {
        if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;

        try {
            await profileService.deleteProfile(profileId);
            loadProfiles();
            loadStats();
        } catch (error) {
            console.error('탈퇴 처리 실패:', error);
        }
    };

    // 필터 변경 - 검색어, 상태, 가입경로 필터 업데이트
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
    };

    // Table columns definition
    const columns: Column<Profile>[] = [
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
    ];

    // TODO: CSV 내보내기 기능 구현 예정
    // const handleExportProfiles = async () => {
    //     // CSV 내보내기 로직 구현
    // };

    return (
        <div className="space-y-6 p-5">
            {/* 간단한 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">활성 사용자</div>
                    <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">비활성</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">탈퇴</div>
                    <div className="text-2xl font-bold text-red-600">{stats.deleted}</div>
                </div>
            </div>

            {/* Search & Filters */}
            <AdminCard>
                <FilterBar
                    filters={[
                        {
                            id: 'search',
                            type: 'search',
                            placeholder: '이메일 또는 이름으로 검색...',
                            value: filters.search,
                            onChange: (value: string) => handleFilterChange('search', value),
                        },
                        {
                            id: 'status',
                            type: 'select',
                            value: filters.status,
                            onChange: (value: string) => handleFilterChange('status', value),
                            options: [
                                { value: 'all', label: '전체 상태' },
                                { value: 'active', label: '활성' },
                                { value: 'inactive', label: '비활성' },
                                { value: 'deleted', label: '탈퇴' },
                            ],
                        },
                        {
                            id: 'provider',
                            type: 'select',
                            value: filters.provider,
                            onChange: (value: string) => handleFilterChange('provider', value),
                            options: [
                                { value: 'all', label: '전체 가입경로' },
                                { value: 'email', label: '이메일' },
                                { value: 'google', label: '구글' },
                                { value: 'kakao', label: '카카오' },
                            ],
                        },
                    ]}
                    hasActiveFilters={filters.search !== '' || filters.status !== 'all' || filters.provider !== 'all'}
                    onClear={() => {
                        setFilters({ search: '', status: 'all', provider: 'all' });
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
            <DataState loading={loading} error={error} data={profiles} onRetry={loadProfiles}>
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
            <div className="flex items-center justify-center space-x-2">
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    onClick={() => pagination.setPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                >
                    이전
                </button>
                <span className="text-sm text-muted-foreground">
                    {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    onClick={() => pagination.setPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                >
                    다음
                </button>
            </div>

            {/* Profile Detail Modal */}
            {modalProfile && <ProfileDetailModal profile={modalProfile} onClose={() => setModalProfile(null)} />}
        </div>
    );
}

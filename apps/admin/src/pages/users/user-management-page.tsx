import { formatDate } from '@repo/shared';
import { profileService, type Profile, type ProfileFilters, type ProfileStats, type ProfileWithActivity } from '@repo/supabase';
import { Badge, Button, DataTable, Pagination, type Column } from '@repo/ui';
import { Eye, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ProfileDetailModal } from '../../features/users';
import { AdminCard, DataState, FilterBar, StatsCards, BulkActions } from '../../shared/components';
import { PAGINATION } from '../../shared/lib';
import { useColumnRenderers } from '../../shared/hooks';

export function UserManagementPage() {
    const renderers = useColumnRenderers();

    // Core state
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [selectedProfile, setSelectedProfile] = useState<ProfileWithActivity | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Selection state
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

    // Filters and pagination
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        provider: 'all',
        page: 1,
    });
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalProfiles: 0,
    });

    // Stats
    const [stats, setStats] = useState<ProfileStats>({
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
        today: 0,
        this_week: 0,
        this_month: 0,
        email_signups: 0,
        google_signups: 0,
        kakao_signups: 0,
    });

    // API calls
    const loadProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const apiFilters: ProfileFilters = {
                search: filters.search || undefined,
                status: filters.status !== 'all' ? (filters.status as Profile['status']) : undefined,
                provider: filters.provider !== 'all' ? filters.provider : undefined,
            };

            const data = await profileService.getProfiles(apiFilters, filters.page, PAGINATION.DEFAULT_PAGE_SIZE);
            setProfiles(data.profiles);
            setPagination({
                totalPages: data.totalPages,
                totalProfiles: data.total,
            });
        } catch (error) {
            console.error('프로필 목록 로딩 실패:', error);
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const loadStats = useCallback(async () => {
        try {
            const statsData = await profileService.getProfileStats();
            setStats(statsData);
        } catch (error) {
            console.error('통계 로딩 실패:', error);
        }
    }, []);

    // Effects
    useEffect(() => {
        loadProfiles();
        loadStats();
    }, [loadProfiles, loadStats]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev: typeof filters) => ({ ...prev, page: 1 }));
        }, PAGINATION.DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [filters.search, filters.status, filters.provider]);

    // Event handlers
    const handleStatusChange = async (profileId: string, newStatus: Profile['status']) => {
        try {
            await profileService.updateProfileStatus(profileId, newStatus);
            loadProfiles();
            loadStats();
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    };

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

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev: typeof filters) => ({ ...prev, page }));
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
                renderers.renderActions(row.original.id, row.original, [
                    {
                        type: 'view',
                        onClick: async (id) => {
                            try {
                                const details = await profileService.getProfileDetails(id);
                                setSelectedProfile(details);
                                setShowProfileModal(true);
                            } catch (error) {
                                console.error('프로필 상세 조회 실패:', error);
                            }
                        },
                    },
                    {
                        type: 'status',
                        onClick: (id, data) => handleStatusChange(id, data.status as Profile['status']),
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">👥 사용자 관리</h1>
                    <p className="text-gray-600 mt-1">등록된 모든 사용자를 조회하고 관리하세요</p>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards
                stats={[
                    { id: 'active', label: '활성 사용자', value: stats.active, color: 'green' },
                    { id: 'inactive', label: '비활성', value: stats.inactive, color: 'yellow' },
                    { id: 'deleted', label: '탈퇴', value: stats.deleted, color: 'red' },
                    { id: 'today', label: '오늘 가입', value: stats.today, color: 'purple' },
                    { id: 'this_week', label: '이번 주', value: stats.this_week, color: 'indigo' },
                    { id: 'this_month', label: '이번 달', value: stats.this_month, color: 'pink' },
                ]}
            />

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
                    actions={
                        <>
                            {/* TODO: CSV 내보내기 버튼 추가 예정 */}
                            {/* <Button onClick={handleExportProfiles} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                            </Button> */}
                        </>
                    }
                />

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
                            className: 'text-red-600 border-red-600 hover:bg-red-50',
                        },
                    ]}
                    onClear={() => setSelectedProfiles([])}
                />
            </AdminCard>

            {/* User List */}
            <DataState loading={loading} error={error} data={profiles} onRetry={loadProfiles}>
                <DataTable
                    data={profiles}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedProfiles}
                    onSelectionChange={setSelectedProfiles}
                    getRowId={(profile: Profile) => profile.id}
                    totalCount={pagination.totalProfiles}
                    totalLabel="사용자"
                />
            </DataState>

            {/* Pagination */}
            <Pagination
                currentPage={filters.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalProfiles}
                pageSize={PAGINATION.DEFAULT_PAGE_SIZE}
                onPageChange={handlePageChange}
            />

            {/* Profile Detail Modal */}
            {showProfileModal && selectedProfile && (
                <ProfileDetailModal
                    profile={selectedProfile}
                    onClose={() => {
                        setShowProfileModal(false);
                        setSelectedProfile(null);
                    }}
                />
            )}
        </div>
    );
}

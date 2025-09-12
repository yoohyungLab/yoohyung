import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Button } from '@repo/ui';
import { profileService, type ProfileWithActivity, type ProfileActivity, type ProfileFeedback } from '@repo/supabase';
import { getStatusConfig, getProviderText } from '../../shared/lib';
import { formatDuration } from '@repo/shared';
import { AdminCard, AdminCardHeader, AdminCardContent } from '../ui';

interface ProfileDetailModalProps {
    profile: ProfileWithActivity;
    onClose: () => void;
}

export function ProfileDetailModal({ profile, onClose }: ProfileDetailModalProps) {
    const [activities, setActivities] = useState<ProfileActivity[]>([]);
    const [feedbacks, setFeedbacks] = useState<ProfileFeedback[]>([]);
    const [loading, setLoading] = useState(true);

    const loadActivities = useCallback(async () => {
        setLoading(true);
        try {
            const [activitiesData, feedbacksData] = await Promise.all([
                profileService.getProfileActivity(profile.id),
                profileService.getProfileFeedbacks(profile.id),
            ]);

            setActivities(activitiesData);
            setFeedbacks(feedbacksData);
        } catch (error) {
            console.error('활동 내역 조회 실패:', error);
        }
        setLoading(false);
    }, [profile.id]);

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const getStatusBadge = (status: string) => {
        const statusConfig = getStatusConfig(status);
        return <Badge className={statusConfig.color}>{statusConfig.text}</Badge>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{profile.name} 상세 정보</h2>
                    <Button variant="outline" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 기본 정보 */}
                    <div className="lg:col-span-1">
                        <AdminCard variant="outline">
                            <AdminCardHeader title="기본 정보" />
                            <AdminCardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">이메일</label>
                                    <p className="text-sm text-gray-900">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">이름</label>
                                    <p className="text-sm text-gray-900">{profile.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">가입경로</label>
                                    <p className="text-sm text-gray-900">{getProviderText(profile.provider)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">상태</label>
                                    {(() => {
                                        const statusConfig = getStatusConfig(profile.status);
                                        return <Badge className={`w-fit ${statusConfig.color}`}>{statusConfig.text}</Badge>;
                                    })()}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">가입일</label>
                                    <p className="text-sm text-gray-900">{new Date(profile.created_at).toLocaleDateString('ko-KR')}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">최근 수정일</label>
                                    <p className="text-sm text-gray-900">{new Date(profile.updated_at).toLocaleDateString('ko-KR')}</p>
                                </div>
                            </AdminCardContent>
                        </AdminCard>
                    </div>

                    {/* 활동 통계 & 최근 기록 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 통계 */}
                        <AdminCard variant="elevated">
                            <AdminCardHeader title="활동 통계" />
                            <AdminCardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{profile.activity?.total_responses || 0}</div>
                                        <div className="text-sm text-gray-500">총 응답수</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{profile.activity?.unique_tests || 0}</div>
                                        <div className="text-sm text-gray-500">참여 테스트</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {profile.activity?.avg_completion_rate
                                                ? `${(profile.activity.avg_completion_rate * 100).toFixed(1)}%`
                                                : '-'}
                                        </div>
                                        <div className="text-sm text-gray-500">평균 완료율</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {profile.activity?.avg_duration_sec ? formatDuration(profile.activity.avg_duration_sec) : '-'}
                                        </div>
                                        <div className="text-sm text-gray-500">평균 소요시간</div>
                                    </div>
                                </div>
                                {profile.activity?.top_result_type && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="text-sm font-medium text-gray-700">인기 결과 유형</div>
                                        <div className="text-lg font-semibold text-gray-900 mt-1">{profile.activity.top_result_type}</div>
                                    </div>
                                )}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-sm font-medium text-gray-700">활동 점수</div>
                                    <div className="text-lg font-semibold text-gray-900 mt-1">
                                        {profile.activity?.activity_score || 0}점
                                    </div>
                                </div>
                            </AdminCardContent>
                        </AdminCard>

                        {/* 최근 활동 */}
                        <AdminCard>
                            <AdminCardHeader title="최근 활동" />
                            <AdminCardContent>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    </div>
                                ) : activities.length > 0 ? (
                                    <div className="space-y-3">
                                        {activities.map((activity: ProfileActivity) => (
                                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{activity.test_emoji}</span>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{activity.test_title}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(activity.started_at).toLocaleDateString('ko-KR')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="mb-1">{getStatusBadge(activity.status)}</div>
                                                    {activity.result_type !== '결과 없음' && (
                                                        <Badge variant="outline" className="mb-1">
                                                            {activity.result_type}
                                                        </Badge>
                                                    )}
                                                    {activity.duration_sec > 0 && (
                                                        <div className="text-xs text-gray-500">{formatDuration(activity.duration_sec)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">활동 내역이 없습니다</div>
                                )}
                            </AdminCardContent>
                        </AdminCard>

                        {/* 최근 건의사항 */}
                        <AdminCard>
                            <AdminCardHeader title="최근 건의사항" />
                            <AdminCardContent>
                                {feedbacks.length > 0 ? (
                                    <div className="space-y-3">
                                        {feedbacks.map((feedback: ProfileFeedback) => (
                                            <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="font-medium text-gray-900">{feedback.title}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {feedback.category} • {feedback.status} •
                                                    {new Date(feedback.created_at).toLocaleDateString('ko-KR')}
                                                </div>
                                                {feedback.admin_reply && (
                                                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                                                        <strong>관리자 답변:</strong> {feedback.admin_reply}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">건의사항 내역이 없습니다</div>
                                )}
                            </AdminCardContent>
                        </AdminCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

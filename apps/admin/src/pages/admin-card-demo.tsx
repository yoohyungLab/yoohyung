import React from 'react';
import { AdminCard, AdminCardHeader, AdminCardContent, AdminCardTitle } from '../components/ui';
import { Button, Badge } from '@repo/ui';
import { Users, Settings, BarChart3, MessageSquare } from 'lucide-react';

export function AdminCardDemo() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">AdminCard 컴포넌트 데모</h1>

            {/* 기본 카드 */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">기본 카드</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AdminCard>
                        <AdminCardHeader title="기본 카드" />
                        <AdminCardContent>
                            <p className="text-gray-600">이것은 기본 AdminCard입니다.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="outline">
                        <AdminCardHeader title="아웃라인 카드" />
                        <AdminCardContent>
                            <p className="text-gray-600">테두리가 강조된 카드입니다.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="elevated">
                        <AdminCardHeader title="엘리베이티드 카드" />
                        <AdminCardContent>
                            <p className="text-gray-600">그림자가 있는 카드입니다.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="bordered">
                        <AdminCardHeader title="보더드 카드" />
                        <AdminCardContent>
                            <p className="text-gray-600">왼쪽에 강조선이 있는 카드입니다.</p>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>

            {/* 아이콘이 있는 카드 */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">아이콘이 있는 카드</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminCard>
                        <AdminCardHeader
                            title="사용자 관리"
                            icon={<Users className="w-5 h-5 text-blue-600" />}
                            action={<Badge variant="outline">12</Badge>}
                        />
                        <AdminCardContent>
                            <p className="text-sm text-gray-600">총 12명의 사용자가 있습니다.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="outline">
                        <AdminCardHeader
                            title="설정"
                            icon={<Settings className="w-5 h-5 text-green-600" />}
                            action={
                                <Button size="sm" variant="outline">
                                    편집
                                </Button>
                            }
                        />
                        <AdminCardContent>
                            <p className="text-sm text-gray-600">시스템 설정을 관리하세요.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="elevated">
                        <AdminCardHeader title="통계" icon={<BarChart3 className="w-5 h-5 text-purple-600" />} subtitle="최근 7일" />
                        <AdminCardContent>
                            <div className="text-2xl font-bold text-purple-600">1,234</div>
                            <p className="text-sm text-gray-600">총 방문자</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="bordered">
                        <AdminCardHeader
                            title="메시지"
                            icon={<MessageSquare className="w-5 h-5 text-orange-600" />}
                            action={<Badge className="bg-orange-100 text-orange-800">3</Badge>}
                        />
                        <AdminCardContent>
                            <p className="text-sm text-gray-600">새로운 메시지가 3개 있습니다.</p>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>

            {/* 패딩 옵션 */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">패딩 옵션</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AdminCard padding="none">
                        <AdminCardHeader title="패딩 없음" />
                        <AdminCardContent padding="none">
                            <div className="p-4 bg-gray-50">
                                <p className="text-gray-600">내부에서 직접 패딩을 관리합니다.</p>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard padding="sm">
                        <AdminCardHeader title="작은 패딩" />
                        <AdminCardContent padding="sm">
                            <p className="text-gray-600">작은 패딩이 적용된 카드입니다.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard padding="lg">
                        <AdminCardHeader title="큰 패딩" />
                        <AdminCardContent padding="lg">
                            <p className="text-gray-600">큰 패딩이 적용된 카드입니다.</p>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>

            {/* 복합 사용 예시 */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">복합 사용 예시</h2>
                <AdminCard variant="elevated">
                    <AdminCardHeader
                        title="대시보드 개요"
                        subtitle="시스템 현황을 한눈에 확인하세요"
                        icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
                        action={
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                    새로고침
                                </Button>
                                <Button size="sm">설정</Button>
                            </div>
                        }
                    />
                    <AdminCardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">1,234</div>
                                <div className="text-sm text-gray-500">총 사용자</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">89%</div>
                                <div className="text-sm text-gray-500">활성 비율</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">567</div>
                                <div className="text-sm text-gray-500">오늘 방문</div>
                            </div>
                        </div>
                    </AdminCardContent>
                </AdminCard>
            </div>
        </div>
    );
}

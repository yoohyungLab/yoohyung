import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Activity, BarChart3, ExternalLink, FileText, Plus, RefreshCw, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 핵심 통계 타입
interface CoreStats {
    totalTests: number;
    publishedTests: number;
    todayResponses: number;
    weeklyResponses: number;
    todayVisitors: number;
    weeklyCompletionRate: number;
    responseGrowth: number;
    visitorGrowth: number;
}

// 핵심 알림 타입
interface CoreAlert {
    id: string;
    type: 'error' | 'warning' | 'success';
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
}

// 간단한 테스트 성과
interface QuickTestStats {
    id: string;
    title: string;
    emoji: string;
    todayResponses: number;
    conversionRate: number;
    trend: 'up' | 'down' | 'stable';
}

export function SimplifiedDashboard() {
    const [stats, setStats] = useState<CoreStats>({
        totalTests: 0,
        publishedTests: 0,
        todayResponses: 0,
        weeklyResponses: 0,
        todayVisitors: 0,
        weeklyCompletionRate: 0,
        responseGrowth: 0,
        visitorGrowth: 0,
    });

    const [alerts, setAlerts] = useState<CoreAlert[]>([]);
    const [topTests, setTopTests] = useState<QuickTestStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        loadDashboardData();

        // 10분마다 자동 새로고침
        const interval = setInterval(loadDashboardData, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);

        // Mock 데이터 (실제로는 API 호출)
        setTimeout(() => {
            setStats({
                totalTests: 42,
                publishedTests: 38,
                todayResponses: 1245,
                weeklyResponses: 8430,
                todayVisitors: 5402,
                weeklyCompletionRate: 78,
                responseGrowth: 15.3,
                visitorGrowth: 8.7,
            });

            setAlerts([
                {
                    id: '1',
                    type: 'warning',
                    title: '응답수 급감 감지',
                    message: 'MBTI 테스트 응답이 평균 대비 25% 감소했습니다',
                    actionUrl: '/tests/1',
                    actionText: '확인하기',
                },
                {
                    id: '2',
                    type: 'success',
                    title: '신규 바이럴 감지',
                    message: '연애 스타일 테스트가 인스타그램에서 급속 확산 중',
                    actionUrl: '/analytics/viral',
                    actionText: '분석보기',
                },
            ]);

            setTopTests([
                { id: '1', title: 'MBTI 성격 테스트', emoji: '🧠', todayResponses: 423, conversionRate: 85, trend: 'down' },
                { id: '2', title: '연애 스타일 찾기', emoji: '💕', todayResponses: 387, conversionRate: 82, trend: 'up' },
                { id: '3', title: '직업 적성 테스트', emoji: '💼', todayResponses: 321, conversionRate: 79, trend: 'stable' },
            ]);

            setLastUpdated(new Date());
            setLoading(false);
        }, 800);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toLocaleString();
    };

    const formatGrowth = (growth: number) => {
        const sign = growth > 0 ? '+' : '';
        return `${sign}${growth.toFixed(1)}%`;
    };

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getGrowthIcon = (growth: number) => {
        if (growth > 0) return <TrendingUp className="w-3 h-3" />;
        if (growth < 0) return <TrendingDown className="w-3 h-3" />;
        return <Activity className="w-3 h-3" />;
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'error':
                return '🚨';
            case 'warning':
                return '⚠️';
            case 'success':
                return '🎉';
            default:
                return 'ℹ️';
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'error':
                return 'border-red-500 bg-red-50';
            case 'warning':
                return 'border-yellow-500 bg-yellow-50';
            case 'success':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-blue-500 bg-blue-50';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            default:
                return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">대시보드를 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-5">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                    <p className="text-gray-600 mt-1">오늘의 핵심 지표</p>
                    <p className="text-sm text-gray-500 mt-1">업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        새로고침
                    </Button>
                    <Link to="/tests/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            테스트 만들기
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 핵심 KPI (4개만) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">활성 테스트</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-blue-600">{stats.publishedTests}</span>
                                    <FileText className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">총 {stats.totalTests}개</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">오늘 응답</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-green-600">{formatNumber(stats.todayResponses)}</span>
                                    <Target className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className={`text-sm flex items-center gap-1 ${getGrowthColor(stats.responseGrowth)}`}>
                                        {getGrowthIcon(stats.responseGrowth)}
                                        {formatGrowth(stats.responseGrowth)}
                                    </span>
                                    <span className="text-sm text-gray-500">전주 대비</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">오늘 방문자</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-purple-600">{formatNumber(stats.todayVisitors)}</span>
                                    <Users className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className={`text-sm flex items-center gap-1 ${getGrowthColor(stats.visitorGrowth)}`}>
                                        {getGrowthIcon(stats.visitorGrowth)}
                                        {formatGrowth(stats.visitorGrowth)}
                                    </span>
                                    <span className="text-sm text-gray-500">전주 대비</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">완료율</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-orange-600">{stats.weeklyCompletionRate}%</span>
                                    <BarChart3 className="w-6 h-6 text-orange-500" />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">이번 주 평균</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 알림 영역 (간소화) */}
            {alerts.length > 0 && (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{getAlertIcon(alert.type)}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{alert.title}</p>
                                            <p className="text-sm text-gray-600">{alert.message}</p>
                                        </div>
                                    </div>
                                    {alert.actionUrl && (
                                        <Link to={alert.actionUrl}>
                                            <Button size="sm" variant="outline">
                                                {alert.actionText || '확인'}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 오늘의 테스트 성과 (TOP 3만) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>오늘의 인기 테스트</span>
                            <Link to="/analytics/tests">
                                <Button variant="outline" size="sm">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    전체 보기
                                </Button>
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topTests.map((test, index) => (
                                <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                                        <span className="text-2xl">{test.emoji}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{test.title}</p>
                                            <p className="text-sm text-gray-500">오늘 {formatNumber(test.todayResponses)}명 응답</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">{test.conversionRate}%</p>
                                            <p className="text-xs text-gray-500">전환율</p>
                                        </div>
                                        {getTrendIcon(test.trend)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 빠른 액션 */}
                <Card>
                    <CardHeader>
                        <CardTitle>빠른 액션</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Link to="/tests/create">
                                <button className="w-full text-left p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Plus className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-700">새 테스트 만들기</p>
                                            <p className="text-sm text-blue-600">템플릿으로 빠르게 생성</p>
                                        </div>
                                    </div>
                                </button>
                            </Link>

                            <Link to="/analytics">
                                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="w-6 h-6 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">상세 분석</p>
                                                <p className="text-sm text-gray-500">심화 데이터 분석</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>
                            </Link>

                            <Link to="/tests">
                                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">테스트 관리</p>
                                                <p className="text-sm text-gray-500">편집 및 설정 변경</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>
                            </Link>

                            <Link to="/users">
                                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-6 h-6 text-orange-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">사용자 관리</p>
                                                <p className="text-sm text-gray-500">유저 현황 및 관리</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

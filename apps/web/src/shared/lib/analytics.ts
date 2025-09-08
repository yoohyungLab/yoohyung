// 분석 도구 통합 유틸리티
// Google Analytics, Mixpanel, Amplitude 등 다양한 분석 도구를 지원

interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
    userId?: string;
    sessionId?: string;
}

interface PageViewEvent {
    page: string;
    title?: string;
    properties?: Record<string, any>;
}

class Analytics {
    private isInitialized = false;
    private userId: string | null = null;
    private sessionId: string;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.initialize();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private initialize() {
        // Google Analytics 초기화 (실제 구현 시)
        if (typeof window !== 'undefined' && window.gtag) {
            this.isInitialized = true;
        }

        // Mixpanel 초기화 (실제 구현 시)
        if (typeof window !== 'undefined' && window.mixpanel) {
            this.isInitialized = true;
        }

        // 로컬 스토리지에서 사용자 ID 가져오기
        this.userId = localStorage.getItem('userId');
    }

    // 사용자 ID 설정
    setUserId(userId: string) {
        this.userId = userId;
        localStorage.setItem('userId', userId);
    }

    // 이벤트 트래킹
    track(event: string, properties?: Record<string, any>) {
        const analyticsEvent: AnalyticsEvent = {
            event,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
            },
            userId: this.userId || undefined,
        };

        // Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', event, {
                event_category: properties?.category || 'engagement',
                event_label: properties?.label,
                value: properties?.value,
                ...properties,
            });
        }

        // Mixpanel
        if (typeof window !== 'undefined' && window.mixpanel) {
            window.mixpanel.track(event, analyticsEvent.properties);
        }

        // 개발 환경에서 콘솔 로그
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Event:', analyticsEvent);
        }

        // 서버로 이벤트 전송 (선택적)
        this.sendToServer(analyticsEvent);
    }

    // 페이지 뷰 트래킹
    pageView(page: string, title?: string, properties?: Record<string, any>) {
        const pageViewEvent: PageViewEvent = {
            page,
            title: title || document.title,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
            },
        };

        // Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: pageViewEvent.title,
                page_location: window.location.href,
                ...pageViewEvent.properties,
            });
        }

        // Mixpanel
        if (typeof window !== 'undefined' && window.mixpanel) {
            window.mixpanel.track('Page View', pageViewEvent.properties);
        }

        // 개발 환경에서 콘솔 로그
        if (process.env.NODE_ENV === 'development') {
            console.log('📄 Page View:', pageViewEvent);
        }
    }

    // 서버로 이벤트 전송
    private async sendToServer(event: AnalyticsEvent) {
        try {
            await fetch('/api/analytics/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        } catch (error) {
            console.error('Failed to send analytics event to server:', error);
        }
    }

    // 결과 페이지 관련 이벤트들
    trackResultViewed(testId: string, resultType: string, isLoggedIn: boolean) {
        this.track('result_viewed', {
            test_id: testId,
            result_type: resultType,
            is_logged_in: isLoggedIn,
            category: 'test_result',
        });
    }

    trackResultShared(channel: string, testId: string, resultType: string) {
        this.track('result_shared', {
            channel,
            test_id: testId,
            result_type: resultType,
            category: 'sharing',
        });
    }

    trackCtaClicked(ctaType: string, testId: string, additionalProperties?: Record<string, any>) {
        this.track('cta_clicked', {
            cta_type: ctaType,
            test_id: testId,
            category: 'conversion',
            ...additionalProperties,
        });
    }

    trackNextTestImpression(items: Array<{ test_id: string; rank: number }>, algorithm: string) {
        this.track('next_test_impression', {
            items,
            algorithm,
            category: 'recommendation',
        });
    }

    trackTestStarted(testId: string, userId?: string) {
        this.track('test_started', {
            test_id: testId,
            user_id: userId,
            category: 'test_engagement',
        });
    }

    trackTestCompleted(testId: string, resultType: string, score: number, duration: number) {
        this.track('test_completed', {
            test_id: testId,
            result_type: resultType,
            score,
            duration_seconds: duration,
            category: 'test_completion',
        });
    }

    trackUserSignup(method: string, source?: string) {
        this.track('user_signup', {
            method,
            source,
            category: 'user_acquisition',
        });
    }

    trackUserLogin(method: string) {
        this.track('user_login', {
            method,
            category: 'user_engagement',
        });
    }
}

// 싱글톤 인스턴스 생성
export const analytics = new Analytics();

// 편의 함수들
export const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
};

export const trackPageView = (page: string, title?: string, properties?: Record<string, any>) => {
    analytics.pageView(page, title, properties);
};

// 결과 페이지 전용 트래킹 함수들
export const trackResultViewed = (testId: string, resultType: string, isLoggedIn: boolean) => {
    analytics.trackResultViewed(testId, resultType, isLoggedIn);
};

export const trackResultShared = (channel: string, testId: string, resultType: string) => {
    analytics.trackResultShared(channel, testId, resultType);
};

export const trackCtaClicked = (ctaType: string, testId: string, additionalProperties?: Record<string, any>) => {
    analytics.trackCtaClicked(ctaType, testId, additionalProperties);
};

export const trackNextTestImpression = (items: Array<{ test_id: string; rank: number }>, algorithm: string) => {
    analytics.trackNextTestImpression(items, algorithm);
};

// 타입 정의
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        mixpanel?: {
            track: (event: string, properties?: Record<string, any>) => void;
            identify: (userId: string) => void;
            people: {
                set: (properties: Record<string, any>) => void;
            };
        };
    }
}

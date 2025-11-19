/**
 * Shared UI Components - Public API
 *
 * FSD 권장사항: 컴포넌트 타입별로 그룹화
 */

// ============ External UI Library ============
export { Badge } from '@pickid/ui';

// ============ Cards ============
export { BaseCard, CardImage, CardTags, CardContent, HomeCard, CarouselCard } from './cards';
export type { CardVariant, CardSize, CardAspectRatio } from './cards';

// ============ Icons ============
export { PopularIcon, NewIcon, RecommendedIcon, TrendingIcon, TestIcon } from './icons';

// ============ Common Components ============
export { GoogleAnalytics } from './google-analytics';
export { Loading } from './loading';

// ============ SEO Components ============
export { TestResultStructuredData } from './seo';
export type { ITestResultStructuredDataProps } from './seo';

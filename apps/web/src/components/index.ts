// Shared UI Components - Public API
//
// FSD 권장사항: 컴포넌트 타입별로 그룹화


export { Badge } from '@pickid/ui';


export { BaseCard, CardImage, CardTags, CardContent, HomeCard, CarouselCard } from './cards';
export type { CardVariant, CardSize, CardAspectRatio } from './cards';


export { PopularIcon, NewIcon, RecommendedIcon, TrendingIcon, TestIcon } from './icons';


export { GoogleAnalytics } from './google-analytics';
export { Loading } from './loading';


export { TestResultStructuredData } from './seo';
export type { ITestResultStructuredDataProps } from './seo';

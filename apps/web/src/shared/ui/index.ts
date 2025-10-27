// ============================================================================
// Shared UI Components - Public API
// ============================================================================

// Badge Components
export { Badge } from '@pickid/ui';

// Card Components
export { BaseCard, CardImage, CardTags, CardContent } from './cards/base-card';
export { HomeCard } from './cards/home-card';
export { CarouselCard } from './cards/carousel-card';
export type { CardVariant, CardSize, CardAspectRatio } from './cards/base-card';

// Icon Components
export { PopularIcon, NewIcon, RecommendedIcon, TrendingIcon, TestIcon } from './icons/section-icons';

// Other UI Components
export { ErrorFallback } from './error-fallback';
export { GoogleAnalytics } from './google-analytics';
export { Loading } from './loading';

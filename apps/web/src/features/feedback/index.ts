/**
 * Feature: Feedback
 *
 * FSD 구조: 중간 크기 feature
 * 세그먼트가 많아지면 개별 import 권장: @/features/feedback/ui, @/features/feedback/model
 */

// ============ UI Components ============
export { FeedbackCategorySelector } from './ui/feedback-category-selector';
export { FeedbackForm } from './ui/feedback-form';
export { FeedbackList } from './ui/feedback-list';

// ============ Model (Hooks) ============
export { useFeedbackList, useFeedbackDetail, useFeedbackSubmit } from './model/use-feedback';

// ============ Lib (Utils) ============
export { getCategoryInfo, getStatusInfo, getStatusClassName } from './lib/utils';
export { formatDate, formatDateTime } from '@/shared/lib';

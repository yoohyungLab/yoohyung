/**
 * Feature: Test
 *
 * FSD 권장사항: 세그먼트에서 직접 import하세요
 *
 * @example
 * // ✅ Recommended
 * import { TestIntro } from '@/features/test/ui';
 * import { useTestResult } from '@/features/test/hooks';
 * import { useTestList } from '@/features/test/model';
 * import { colorThemes } from '@/features/test/lib';
 *
 * // ❌ Deprecated (이 파일은 향후 제거될 예정)
 * import { TestIntro, useTestResult } from '@/features/test';
 */

// ============ Public API by Segment ============
// 각 세그먼트에서 직접 import하는 것을 권장합니다

export * from './ui';
export * from './hooks';
export * from './model';
export * from './lib';

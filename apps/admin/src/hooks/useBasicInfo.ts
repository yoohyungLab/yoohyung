import { useCallback, useState } from 'react';
import type { BasicInfo } from '../components/test/test-create/types';
import { generateShortCode, generateSlug } from '../utils/slugUtils';

export const useBasicInfo = () => {
    const [basicInfo, setBasicInfo] = useState<BasicInfo>({
        title: '',
        description: '',
        intro_text: '',
        category_ids: [],
        short_code: '',
        slug: '',
        thumbnail_url: '',
        estimated_time: 5,
        status: 'draft',
        scheduled_at: null,
        published_at: null,
        max_score: 100,
        type: null,
    });

    const updateBasicInfo = useCallback((updates: Partial<typeof basicInfo>) => {
        setBasicInfo((prev) => {
            const newInfo = { ...prev, ...updates };

            // title이 변경될 때 slug 자동 생성 (최종 제출 시에만)
            if (updates.title && !updates.slug) {
                const baseSlug = generateSlug(updates.title);
                if (baseSlug && baseSlug.trim() !== '') {
                    newInfo.slug = baseSlug;
                }
            }

            return newInfo;
        });
    }, []);

    // 최종 제출 시 short_code와 slug 생성
    const prepareForSubmission = useCallback(() => {
        setBasicInfo((prev) => {
            const newInfo = { ...prev };

            // short_code가 없으면 생성
            if (!newInfo.short_code) {
                newInfo.short_code = generateShortCode();
            }

            // slug가 없으면 제목에서 생성
            if (!newInfo.slug && newInfo.title) {
                newInfo.slug = generateSlug(newInfo.title);
            }

            return newInfo;
        });
    }, []);

    return {
        basicInfo,
        updateBasicInfo,
        prepareForSubmission,
    };
};

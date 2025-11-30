import { supabase } from '@pickid/supabase';
import type { OptimizedChoiceStats, OptimizedQuestionStats } from '@pickid/supabase';

export const optimizedBalanceGameStatsService = {
    async getAllQuestionStatsRaw(testId: string): Promise<OptimizedQuestionStats[]> {
        const { data: questions, error: questionsError } = await supabase
            .from('test_questions')
            .select('id, question_text')
            .eq('test_id', testId);

        if (questionsError) {
            throw new Error(`Error fetching questions for stats: ${questionsError.message}`);
        }

        const questionIds = questions.map(q => q.id);

        const { data: choices, error: choicesError } = await supabase
            .from('test_choices')
            .select('id, choice_text, question_id, response_count')
            .in('question_id', questionIds);

        if (choicesError) {
            throw new Error(`Error fetching choices for stats: ${choicesError.message}`);
        }

        const statsMap = new Map<string, OptimizedQuestionStats>();

        questions.forEach(q => {
            statsMap.set(q.id, {
                questionId: q.id,
                questionText: q.question_text,
                choiceStats: [],
                totalResponses: 0,
            });
        });

        choices.forEach(c => {
            const questionStat = statsMap.get(c.question_id || '');
            if (questionStat) {
                const choiceStat: OptimizedChoiceStats = {
                    choiceId: c.id,
                    choiceText: c.choice_text,
                    responseCount: c.response_count || 0,
                    percentage: 0, // Will be calculated later
                };
                questionStat.choiceStats.push(choiceStat);
                questionStat.totalResponses += (c.response_count || 0);
            }
        });

        return Array.from(statsMap.values());
    },
};
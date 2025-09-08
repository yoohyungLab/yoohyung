import { getChemistryTags, getYouthPicks, getCareerSuggestions /* + (선택) getResultDisclaimer */ } from '../model/result-calculator';

interface ResultDetailsProps {
    egenPct: number;
    tetoPct: number;
    characteristics: string[]; // 테스트 고유 특징(간단 3~5줄)
}

export function ResultDetails({ egenPct, tetoPct, characteristics }: ResultDetailsProps) {
    const chemistry = getChemistryTags(egenPct, tetoPct);
    const youthPicks = getYouthPicks(egenPct, tetoPct);
    const careerSuggestions = getCareerSuggestions(egenPct, tetoPct); // ✅ 추가

    return (
        <div className="space-y-6">
            {/* 특징 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">✨ 주요 특징</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                    {characteristics.map((char, i) => (
                        <li
                            key={i}
                            className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-gray-700"
                        >
                            {char}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 케미 태그 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">💛 케미 태그</h3>
                <div className="flex flex-wrap gap-2">
                    {chemistry.map((tag, i) => (
                        <span
                            key={i}
                            className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 10·20대 취향 픽 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">🎁 취향 픽</h3>
                <div className="flex flex-wrap gap-2">
                    {youthPicks.map((it, i) => (
                        <span
                            key={i}
                            className="bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-full border border-rose-200"
                        >
                            {it}
                        </span>
                    ))}
                </div>
            </div>

            {/* 커리어 제안 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">💼 커리어·활동 제안</h3>
                <div className="flex flex-wrap gap-2">
                    {careerSuggestions.map((job, i) => (
                        <span
                            key={i}
                            className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-200"
                        >
                            {job}
                        </span>
                    ))}
                </div>
                {/* (선택) 안전 안내문 */}
                {/* <p className="text-xs text-gray-500 mt-3 whitespace-pre-line">{getResultDisclaimer()}</p> */}
            </div>
        </div>
    );
}

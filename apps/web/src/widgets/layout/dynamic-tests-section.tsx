'use client';

import { useRouter } from 'next/navigation';

interface Test {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

interface DynamicTestsSectionProps {
    tests: Test[];
}

export function DynamicTestsSection({ tests }: DynamicTestsSectionProps) {
    const router = useRouter();

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">동적 테스트</h2>
                <button onClick={() => router.push('/tests')} className="text-blue-600 hover:text-blue-700 font-medium">
                    전체보기 →
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <div
                        key={test.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => router.push(`/tests/${test.id}`)}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                                {test.title.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {test.title}
                                </h3>
                                <p className="text-sm text-gray-500">{test.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {test.tags.map((tag, index) => (
                                <span key={index} className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                            시작하기
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}









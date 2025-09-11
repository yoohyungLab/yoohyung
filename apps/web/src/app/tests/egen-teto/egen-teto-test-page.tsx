'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gender } from '@/shared/types';

export default function EgenTetoTestPage() {
    const [currentStep, setCurrentStep] = useState<'gender' | 'questionnaire'>('gender');
    const [, setSelectedGender] = useState<Gender | null>(null);

    // const router = useRouter();

    const handleGenderSelect = (gender: Gender) => {
        setSelectedGender(gender);
        setCurrentStep('questionnaire');
    };

    // const handleQuestionnaireComplete = (finalAnswers: number[]) => {
    //     const score = finalAnswers.reduce((sum, answer) => sum + answer, 0);

    //     let testResult;
    //     if (score >= 3) {
    //         testResult = selectedGender === 'male' ? 'egen-male' : 'egen-female';
    //     } else if (score <= -3) {
    //         testResult = selectedGender === 'male' ? 'teto-male' : 'teto-female';
    //     } else {
    //         testResult = 'mixed';
    //     }

    //     router.push(`/tests/egen-teto/callback?type=${testResult}&score=${score}&gender=${selectedGender}`);
    // };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-10 bg-no-repeat bg-top bg-cover"
            style={{ backgroundImage: "url('/images/egen-teto/background.png')" }}
        >
            {currentStep === 'questionnaire' && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0 transition-all duration-300" />
            )}
            <div className="w-full max-w-[400px] flex flex-col items-center justify-start pt-[40%] relative z-10">
                {currentStep === 'gender' && (
                    <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 -mt-[80px]">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-pink-600 mb-1 tracking-tight">에겐·테토 테스트</h1>
                            <p className="text-sm text-gray-600">당신의 호르몬 성향은? 지금 테스트해보세요</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <button
                                onClick={() => handleGenderSelect('male')}
                                className="flex gap-1 items-center justify-center bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 text-blue-700 py-3 font-medium text-sm transition active:scale-95"
                            >
                                <Image src="/icons/men.svg" alt="남자" width={24} height={24} className="mb-1" />
                                남자
                            </button>
                            <button
                                onClick={() => handleGenderSelect('female')}
                                className="flex gap-1 items-center justify-center bg-white border border-rose-200 rounded-lg shadow-sm hover:bg-rose-50 text-rose-600 py-3 font-medium text-sm transition active:scale-95"
                            >
                                <Image src="/icons/women.svg" alt="여자" width={24} height={24} className="mb-1" />
                                여자
                            </button>
                        </div>
                    </div>
                )}
                {/* TODO: 작업 필요 */}
                {/* {currentStep === 'questionnaire' && selectedGender && (
                    <Question gender={selectedGender} onComplete={handleQuestionnaireComplete} />
                )} */}
            </div>
        </div>
    );
}

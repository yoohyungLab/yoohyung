import React from 'react';
import { Card, CardContent } from '@repo/ui';
import { Check } from 'lucide-react';

export interface Step {
    id: number;
    title: string;
    description: string;
}

export interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
    disabled?: boolean;
}

export function StepIndicator(props: StepIndicatorProps) {
    const { steps, currentStep, onStepClick, disabled = false } = props;

    return (
        <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4">
                <div className="flex items-center justify-between overflow-x-auto">
                    {steps.map((stepInfo, index) => {
                        const isActive = stepInfo.id === currentStep;
                        const isCompleted = currentStep > stepInfo.id;
                        const canAccess = !disabled && onStepClick;

                        return (
                            <div key={stepInfo.id} className="flex items-center flex-shrink-0">
                                <button
                                    onClick={() => canAccess && onStepClick(stepInfo.id)}
                                    disabled={!canAccess}
                                    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                            : isCompleted
                                            ? 'bg-green-100 text-green-800 hover:bg-green-150'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : isCompleted
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                                        }`}
                                    >
                                        {isCompleted ? <Check className="w-4 h-4" /> : stepInfo.id}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-medium text-sm whitespace-nowrap">{stepInfo.title}</p>
                                        <p className="text-xs opacity-75 whitespace-nowrap hidden sm:block">{stepInfo.description}</p>
                                    </div>
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

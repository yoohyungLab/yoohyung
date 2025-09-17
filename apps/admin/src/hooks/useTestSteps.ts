import { useState, useCallback } from 'react';

export const useTestSteps = () => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState<string | null>(null);

    const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 5)), []);
    const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

    return {
        step,
        type,
        setStep,
        setType,
        nextStep,
        prevStep,
    };
};



import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@repo/ui';
import { testTypes } from '../../../../constants/testData';

interface TypeSelectionStepProps {
    selectedType: any;
    onSelectType: (type: any) => void;
}

export const TypeSelectionStep = ({ selectedType, onSelectType }: TypeSelectionStepProps) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testTypes.map((type) => (
                    <Card
                        key={type.id}
                        onClick={() => onSelectType(type.id)}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                            selectedType === type.id ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' : 'border hover:border-gray-300'
                        }`}
                    >
                        <CardHeader className="text-center">
                            <div
                                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    selectedType === type.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <span className="text-xs font-bold">{type.name[0]}</span>
                            </div>
                            <CardTitle className="text-xl">{type.name}</CardTitle>
                            <p className="text-sm text-gray-600">{type.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">주요 특징</h4>
                                <div className="flex flex-wrap gap-1">
                                    {type.features.map((feature: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">예시</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {type.examples.slice(0, 2).map((example: string, index: number) => (
                                        <li key={index}>• {example}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

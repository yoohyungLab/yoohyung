import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Switch } from '@repo/ui';
import { X } from 'lucide-react';
import { PublishSettingsProps } from '../types';

export function PublishSettings({ testData, onUpdateTestData }: PublishSettingsProps) {
    return (
        <Card className="border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg">발행 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base font-medium">즉시 공개</Label>
                        <p className="text-sm text-gray-600">테스트를 바로 공개할지 설정합니다</p>
                    </div>
                    <Switch
                        checked={testData.status === 'published'}
                        onCheckedChange={(checked) => onUpdateTestData({ ...testData, status: checked ? 'published' : 'draft' })}
                    />
                </div>

                {testData.status === 'draft' && (
                    <div>
                        <label className="text-base font-medium block">예약 발행</label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                type="datetime-local"
                                value={testData.scheduled_at || ''}
                                onChange={(e) => onUpdateTestData({ ...testData, scheduled_at: e.target.value })}
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={() => onUpdateTestData({ ...testData, scheduled_at: null })}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">지정한 시간에 자동으로 공개됩니다</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

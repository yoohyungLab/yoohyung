import { Card, CardContent, Button } from '@repo/ui';
import { Link } from 'react-router-dom';
import { getAlertIcon, getAlertColor } from '@/shared/lib/utils';

interface Alert {
	id: string;
	type: string;
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
}

interface AlertCardProps {
	alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
	return (
		<Card className={`border-l-4 ${getAlertColor(alert.type)}`}>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="text-lg">{getAlertIcon(alert.type)}</span>
						<div>
							<p className="font-medium text-gray-900">{alert.title}</p>
							<p className="text-sm text-gray-600">{alert.message}</p>
						</div>
					</div>
					{alert.actionUrl && (
						<Link to={alert.actionUrl}>
							<Button size="sm" variant="outline">
								{alert.actionText || '확인'}
							</Button>
						</Link>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

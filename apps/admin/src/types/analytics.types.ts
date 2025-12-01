export interface GetTestDetailedStatsReturn {
	testId: string;
	testTitle: string;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgScore: number;
	avgTime: number;
	viewCount: number;
	createdAt: string;
}

export interface AdminGetTestBasicStatsReturn {
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgTime: number;
	avgScore: number;
	deviceBreakdown: {
		mobile: number;
		desktop: number;
		tablet: number;
	};
}

export interface AdminGetTestAnalyticsDataReturn {
	testId: string;
	testTitle: string;
	period: string;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgScore: number;
	avgTime: number;
	dailyData: Array<{
		date: string;
		responses: number;
		completions: number;
	}>;
	scoreDistribution: Array<{
		score: number;
		count: number;
	}>;
}


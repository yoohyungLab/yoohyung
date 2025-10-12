export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
				<p className="text-gray-600 text-sm">로딩 중...</p>
			</div>
		</div>
	);
}

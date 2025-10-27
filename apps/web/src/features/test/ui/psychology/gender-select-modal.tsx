'use client';

import { User, UserRound } from 'lucide-react';

interface GenderSelectModalProps {
	onSelect: (gender: 'male' | 'female') => void;
}

export function GenderSelectModal(props: GenderSelectModalProps) {
	const { onSelect } = props;

	const handleSelectMale = () => {
		onSelect('male');
	};

	const handleSelectFemale = () => {
		onSelect('female');
	};

	return (
		<div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-[2.5rem] z-50 flex items-center justify-center p-4 animate-fadeIn">
			<section className="bg-white rounded-3xl p-8 w-full max-w-xs shadow-2xl animate-slideUp">
				<header className="text-center mb-8">
					<h3 className="text-xl font-bold text-gray-900">성별 선택</h3>
				</header>

				<div className="flex gap-3">
					<button
						onClick={handleSelectMale}
						className="flex-1 group relative overflow-hidden py-6 px-6 rounded-2xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg active:scale-95"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" />
						<div className="relative flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
								<User className="w-6 h-6 text-blue-600" />
							</div>
							<span className="font-bold text-gray-900">남성</span>
						</div>
					</button>

					<button
						onClick={handleSelectFemale}
						className="flex-1 group relative overflow-hidden px-6 rounded-2xl border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg active:scale-95"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
						<div className="relative flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
								<UserRound className="w-6 h-6 text-pink-600" />
							</div>
							<span className="font-bold text-gray-900">여성</span>
						</div>
					</button>
				</div>
			</section>
		</div>
	);
}

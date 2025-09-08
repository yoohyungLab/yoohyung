'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface HomeCardProps {
    id: string;
    title: string;
    image: string;
    tag: string;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
}

export function HomeCard({ id, title, image, tag, isFavorite, onToggleFavorite }: HomeCardProps) {
    return (
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/tests/${id}`} className="block">
                <div className="aspect-square relative overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-2 left-2">
                        <span className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-full font-medium">{tag}</span>
                    </div>
                </div>
                <div className="p-3">
                    <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                            {title}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavorite(id);
                            }}
                            className={cn(
                                'ml-2 p-1 rounded-full transition-colors',
                                isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                            )}
                        >
                            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

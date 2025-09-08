import React from 'react';

interface AdSenseProps {
    position: 'left' | 'right' | 'bottom' | 'mobile-bottom';
    className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ position, className = '' }) => {
    const getAdStyle = () => {
        switch (position) {
            case 'left':
            case 'right':
                return 'w-48 h-96 bg-gray-200 rounded flex items-center justify-center';
            case 'bottom':
                return 'w-full h-20 bg-gray-200 rounded flex items-center justify-center';
            case 'mobile-bottom':
                return 'w-full h-16 bg-gray-200 rounded flex items-center justify-center';
            default:
                return 'w-full h-32 bg-gray-200 rounded flex items-center justify-center';
        }
    };

    const getAdText = () => {
        switch (position) {
            case 'left':
                return '좌측 광고';
            case 'right':
                return '우측 광고';
            case 'bottom':
                return '하단 광고';
            case 'mobile-bottom':
                return '모바일 하단 광고';
            default:
                return '광고';
        }
    };

    return (
        <div className={`ad-container ${getAdStyle()} ${className}`}>
            <span className="text-gray-400 text-sm">{getAdText()}</span>
        </div>
    );
};

export { AdSense };

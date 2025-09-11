import React from 'react';
import { IconProps } from '../types';

export const Icon: React.FC<IconProps & { name: string }> = ({ name, className = '', size = 24, color = 'currentColor' }) => {
    return (
        <svg className={className} width={size} height={size} fill={color} viewBox="0 0 24 24">
            {/* SVG content will be dynamically loaded based on name */}
            <use href={`#${name}`} />
        </svg>
    );
};

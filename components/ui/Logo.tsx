import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg viewBox="0 0 205 40" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Heavenly Dreams Logo">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(99, 102, 241)' }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(129, 140, 248)' }} />
                </linearGradient>
            </defs>
            <text
                x="0"
                y="30"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                fontSize="28"
                fontWeight="bold"
                fill="url(#logoGradient)"
            >
                Heavenly
            </text>
            <text
                x="125"
                y="30"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                fontSize="28"
                fontWeight="300"
                fill="currentColor"
            >
                Dreams
            </text>
        </svg>
    );
};

export default Logo;

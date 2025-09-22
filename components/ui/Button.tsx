
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', Icon, ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "border-transparent text-white bg-black hover:bg-gray-800 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200",
        secondary: "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500"
    };

    return (
        <button
            {...props}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {Icon && <Icon className="w-5 h-5 mr-2 -ml-1" />}
            {children}
        </button>
    );
};

export default Button;
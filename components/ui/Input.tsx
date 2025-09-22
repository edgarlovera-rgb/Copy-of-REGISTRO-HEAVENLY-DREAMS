
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label}
            </label>
            <input
                id={id}
                {...props}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>
    );
};

export default Input;

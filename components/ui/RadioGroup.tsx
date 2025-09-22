
import React from 'react';

interface RadioGroupProps<T extends string> {
    label: string;
    name: string;
    options: T[];
    selectedValue: T;
    onChange: (value: T) => void;
}

function RadioGroup<T extends string>({ label, name, options, selectedValue, onChange }: RadioGroupProps<T>) {
    return (
        <fieldset>
            <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</legend>
            <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                    <div key={option} className="flex items-center">
                        <input
                            id={`${name}-${option}`}
                            name={name}
                            type="radio"
                            checked={selectedValue === option}
                            onChange={() => onChange(option)}
                            className="h-4 w-4 text-indigo-600 border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-indigo-500"
                        />
                        <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-slate-900 dark:text-slate-200">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
    );
}

export default RadioGroup;

import React, { useRef, useEffect } from 'react';

interface FileInputProps {
    label: string;
    id: string;
    optional?: boolean;
    onChange: (file: File | null) => void;
    value: File | null;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, optional = false, onChange, value }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value === null && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [value]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label} {optional && <span className="text-slate-500">(Opcional)</span>}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    ref={fileInputRef}
                    type="file"
                    id={id}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="relative inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-l-md text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <span>Seleccionar archivo</span>
                </button>
                <div className="block w-full px-3 py-2 border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-md text-slate-500 dark:text-slate-400 truncate">
                    {value?.name || 'Ningún archivo seleccionado'}
                </div>
            </div>
        </div>
    );
};

export default FileInput;
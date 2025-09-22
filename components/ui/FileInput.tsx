
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
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {optional && <span className="text-gray-500">(Opcional)</span>}
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
                    className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-l-md text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                    <span>Seleccionar archivo</span>
                </button>
                <div className="block w-full px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-md text-gray-500 dark:text-gray-400 truncate">
                    {value?.name || 'Ningún archivo seleccionado'}
                </div>
            </div>
        </div>
    );
};

export default FileInput;
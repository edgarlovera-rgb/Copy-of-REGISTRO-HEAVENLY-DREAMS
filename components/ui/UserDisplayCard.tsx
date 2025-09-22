import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import Logo from './Logo';

const UserIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

interface UserDisplayCardProps {
    user: User;
    children?: React.ReactNode; // For action buttons
    className?: string;
}

const UserDisplayCard: React.FC<UserDisplayCardProps> = ({ user, children, className = '' }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user.profilePicture) {
            const url = URL.createObjectURL(user.profilePicture);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setImageUrl(null);
    }, [user.profilePicture]);

    return (
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="p-3">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        {imageUrl ? (
                            <img className="h-16 w-16 rounded-full object-cover" src={imageUrl} alt={user.fullName} />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <UserIcon className="h-10 w-10" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-black dark:text-white truncate">{user.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.dateOfBirth}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.Admin ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                            {user.role}
                        </span>
                        {children}
                    </div>
                </div>
            </div>
             {user.role !== UserRole.Admin && (
                <div className="bg-gray-100 dark:bg-gray-900 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                        <Logo className="h-5 w-auto rounded-full object-contain" />
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">Empleado de HEAVENLY DREAMS SAS DE CV</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDisplayCard;
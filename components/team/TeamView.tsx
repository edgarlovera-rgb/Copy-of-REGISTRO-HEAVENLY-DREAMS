import React, { useMemo } from 'react';
import { User } from '../../types';
import Card from '../ui/Card';
import UserDisplayCard from '../ui/UserDisplayCard';

interface TeamViewProps {
    currentUser: User;
    users: User[];
}

const TeamView: React.FC<TeamViewProps> = ({ currentUser, users }) => {
    const supervisor = useMemo(() => {
        if (!currentUser.supervisorId) return null;
        return users.find(u => u.id === currentUser.supervisorId);
    }, [currentUser, users]);

    const teamMembers = useMemo(() => {
        return users.filter(u => u.supervisorId === currentUser.id);
    }, [currentUser, users]);

    return (
        <div>
            {supervisor && (
                <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Mi Supervisor</h2>
                    <UserDisplayCard user={supervisor} />
                </Card>
            )}

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Mi Equipo Directo</h2>
                {teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map(member => (
                            <UserDisplayCard key={member.id} user={member} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No tienes miembros de equipo a tu cargo.</p>
                )}
            </Card>
        </div>
    );
};

export default TeamView;

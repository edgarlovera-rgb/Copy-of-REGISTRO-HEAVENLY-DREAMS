import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface UserManagementProps {
    users: User[];
    onAddUser: (newUser: User) => void;
}

const DocumentArrowDownIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<UserRole>(UserRole.User);
    const [error, setError] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!newUsername.trim() || !newPassword.trim()) {
            setError('El nombre de usuario y la contraseña no pueden estar vacíos.');
            return;
        }
        if (users.some(user => user.username.toLowerCase() === newUsername.toLowerCase())) {
            setError('El nombre de usuario ya existe.');
            return;
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            username: newUsername.trim(),
            password: newPassword,
            role: newRole,
        };
        onAddUser(newUser);
        setNewUsername('');
        setNewPassword('');
        setNewRole(UserRole.User);
        alert(`Usuario "${newUser.username}" creado con éxito.`);
    };

    const handleExportUsersCSV = () => {
        if (users.length === 0) {
            alert('No hay usuarios para exportar.');
            return;
        }

        const headers = ['ID', 'Username', 'Role'];
        const rows = users.map(user => {
            const rowData = [
                user.id,
                user.username,
                user.role
            ];
            // Escape quotes and wrap in double quotes
            return rowData.map(value => {
                const stringValue = String(value ?? '').replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        const today = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `reporte_usuarios_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <h3 className="text-xl font-bold mb-6">Agregar Nuevo Usuario</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <Input
                        id="new-username"
                        label="Nombre de Usuario"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                    />
                    <Input
                        id="new-password"
                        label="Contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <Select
                        id="new-role"
                        label="Rol"
                        options={Object.values(UserRole)}
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                        required
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right pt-2">
                        <Button type="submit">Crear Usuario</Button>
                    </div>
                </form>
            </Card>
            <Card>
                 <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Usuarios Registrados</h3>
                    <Button 
                        variant="secondary" 
                        onClick={handleExportUsersCSV} 
                        disabled={users.length === 0} 
                        Icon={DocumentArrowDownIcon}
                    >
                        Exportar a CSV
                    </Button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {users.map(user => (
                        <div key={user.id} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{user.username}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {user.id}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.Admin ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200'}`}>
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
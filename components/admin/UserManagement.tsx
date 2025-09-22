import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import FileInput from '../ui/FileInput';
import UserDisplayCard from '../ui/UserDisplayCard';

interface UserManagementProps {
    users: User[];
    onAddUser: (newUser: User) => void;
    onDeleteUser: (userId: string) => void;
}

const DocumentArrowDownIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// Roles that can be assigned by an admin. Admin role is excluded.
const assignableRoles = [UserRole.Capacitacion, UserRole.Asesor, UserRole.Supervisor];

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<UserRole>(UserRole.Capacitacion);
    const [newFullName, setNewFullName] = useState('');
    const [newDateOfBirth, setNewDateOfBirth] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [newSupervisorId, setNewSupervisorId] = useState('');
    const [error, setError] = useState('');

    const supervisorOptions = useMemo(() => {
        return users
            .filter(u => u.role === UserRole.Supervisor)
            .map(s => ({ value: s.id, label: s.fullName }));
    }, [users]);
    
    const roleOptions = assignableRoles.map(r => ({ value: r, label: r }));

    const resetForm = () => {
        setNewUsername('');
        setNewPassword('');
        setNewRole(UserRole.Capacitacion);
        setNewFullName('');
        setNewDateOfBirth('');
        setNewProfilePicture(null);
        setNewSupervisorId('');
        setError('');
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedUsername = newUsername.trim();

        if (!/^\d{8}$/.test(trimmedUsername)) {
            setError('La Clave de Usuario debe ser un número de exactamente 8 dígitos.');
            return;
        }
        if (newPassword.length !== 10) {
            setError('La contraseña debe tener exactamente 10 caracteres.');
            return;
        }
        if (!newFullName.trim()) {
            setError('El nombre completo es obligatorio.');
            return;
        }
        if (!newDateOfBirth) {
            setError('La fecha de nacimiento es obligatoria.');
            return;
        }
        if (users.some(user => user.username === trimmedUsername)) {
            setError('La Clave de Usuario ya existe.');
            return;
        }
        if (newRole !== UserRole.Supervisor && !newSupervisorId) {
            setError('Debe seleccionar un supervisor para este rol.');
            return;
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            username: trimmedUsername,
            password: newPassword,
            role: newRole,
            fullName: newFullName.trim(),
            dateOfBirth: newDateOfBirth,
            profilePicture: newProfilePicture || undefined,
            supervisorId: newSupervisorId || undefined,
        };
        onAddUser(newUser);
        alert(`Usuario "${newUser.fullName}" creado con éxito.`);
        resetForm();
    };

    const handleExportUsersCSV = () => {
        if (users.length === 0) {
            alert('No hay usuarios para exportar.');
            return;
        }

        const headers = ['ID', 'Username', 'Role', 'Full Name', 'Date of Birth', 'Supervisor ID'];
        const rows = users.map(user => {
            const rowData = [
                user.id,
                user.username,
                user.role,
                user.fullName,
                user.dateOfBirth,
                user.supervisorId
            ];
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
        alert('La exportación ha comenzado. El archivo se guardará en su carpeta de descargas.');
    };

    const handleDelete = (userId: string, userName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userName}? Esta acción no se puede deshacer.`)) {
            onDeleteUser(userId);
        }
    };

    const isSupervisorRequired = newRole !== UserRole.Supervisor;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <h3 className="text-xl font-bold mb-6">Agregar Nuevo Usuario</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <Input
                        id="new-fullName"
                        label="Nombre Completo"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        required
                    />
                     <Input
                        id="new-dob"
                        label="Fecha de Nacimiento"
                        type="date"
                        value={newDateOfBirth}
                        onChange={(e) => setNewDateOfBirth(e.target.value)}
                        required
                    />
                    <Input
                        id="new-username"
                        label="Clave de Usuario (8 dígitos)"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        pattern="\d{8}"
                        title="La Clave de Usuario debe ser un número de exactamente 8 dígitos."
                        maxLength={8}
                    />
                    <Input
                        id="new-password"
                        label="Contraseña (10 caracteres)"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={10}
                        maxLength={10}
                        title="La contraseña debe tener exactamente 10 caracteres."
                    />
                    <Select
                        id="new-role"
                        label="Rol"
                        options={roleOptions}
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                        required
                    />
                    <Select
                        id="new-supervisor"
                        label="Supervisor Asignado"
                        options={supervisorOptions}
                        value={newSupervisorId}
                        onChange={(e) => setNewSupervisorId(e.target.value)}
                        required={isSupervisorRequired}
                    />
                    <FileInput
                        id="new-profile-pic"
                        label="Foto de Perfil"
                        value={newProfilePicture}
                        onChange={setNewProfilePicture}
                        optional
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
                <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-2">
                    {users.map(u => (
                         <UserDisplayCard key={u.id} user={u}>
                            {u.role !== UserRole.Admin && (
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleDelete(u.id, u.fullName)} 
                                    className="!px-2 !py-1 text-xs text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Borrar
                                </Button>
                            )}
                        </UserDisplayCard>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;

import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Logo from './ui/Logo';

interface LoginScreenProps {
    onLogin: (username: string, password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(username, password);
        if (!success) {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Logo className="h-16 w-auto mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-black dark:text-white">Portal de Ventas SIAC</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Bienvenido, por favor inicie sesión.</p>
                </div>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="username"
                            label="Usuario"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Ingresar
                        </Button>
                    </form>
                </Card>
                 <p className="text-center text-xs text-gray-500 mt-4">
                    Usuario admin: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">admin</code>, 
                    Contraseña: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">admin123</code>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
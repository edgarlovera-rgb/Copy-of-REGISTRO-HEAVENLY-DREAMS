
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { User, UserRole, Sale } from './types';

// Initial admin user as per requirements
const initialUsers: User[] = [
    { id: 'admin-user', username: 'edgarlovera@heavenlyndreams.com.mx', password: 'Lovera9984+', role: UserRole.Admin },
];

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [sales, setSales] = useState<Sale[]>([]);

    const handleLogin = useCallback((username: string, password: string): boolean => {
        const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    }, [users]);

    const handleLogout = useCallback(() => {
        setUser(null);
    }, []);

    const handleAddSale = useCallback((newSale: Sale) => {
        setSales(prevSales => [newSale, ...prevSales]);
    }, []);

    const handleUpdateSale = useCallback((updatedSale: Sale) => {
        setSales(prevSales => prevSales.map(s => s.id === updatedSale.id ? updatedSale : s));
    }, []);
    
    const handleAddUser = useCallback((newUser: User) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
            {user ? (
                <Dashboard 
                    user={user} 
                    onLogout={handleLogout}
                    sales={sales}
                    onAddSale={handleAddSale}
                    onUpdateSale={handleUpdateSale}
                    users={users}
                    onAddUser={handleAddUser}
                />
            ) : (
                <LoginScreen onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
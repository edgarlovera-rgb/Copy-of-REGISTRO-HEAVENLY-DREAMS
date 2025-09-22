
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    const handleLogin = useCallback((username: string) => {
        setIsLoggedIn(true);
        setUser(username);
    }, []);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setUser(null);
    }, []);

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
            {isLoggedIn && user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <LoginScreen onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;

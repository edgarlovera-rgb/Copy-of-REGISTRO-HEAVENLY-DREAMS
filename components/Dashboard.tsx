
import React, { useState, useMemo, useCallback } from 'react';
import SalesForm from './SalesForm';
import FolioSearch from './FolioSearch';
import Button from './ui/Button';
import { Sale, SaleStatus, User, UserRole } from '../types';
import SaleDetailView from './SaleDetailView';
import Logo from './ui/Logo';
import UserManagement from './admin/UserManagement';

interface DashboardProps {
    user: User;
    onLogout: () => void;
    sales: Sale[];
    onAddSale: (newSale: Sale) => void;
    onUpdateSale: (updatedSale: Sale) => void;
    users: User[];
    onAddUser: (newUser: User) => void;
}

type ActiveTab = 'sales' | 'users';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, sales, onAddSale, onUpdateSale, users, onAddUser }) => {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('sales');

    const handleSelectSale = useCallback((sale: Sale) => {
        setSelectedSale(sale);
    }, []);

    const handleCloseDetailView = useCallback(() => {
        setSelectedSale(null);
    }, []);
    
    const handleUpdateSaleStatus = useCallback((saleId: string, newStatus: SaleStatus) => {
        const saleToUpdate = sales.find(s => s.id === saleId);
        if (saleToUpdate) {
            const updatedSale = { ...saleToUpdate, status: newStatus };
            onUpdateSale(updatedSale);
            // If the updated sale is the one being viewed, update the detail view state as well
            if (selectedSale && selectedSale.id === saleId) {
                setSelectedSale(updatedSale);
            }
            alert('¡Estado de la venta actualizado!');
        }
    }, [sales, selectedSale, onUpdateSale]);

    const salesForCurrentUser = useMemo(() => {
        if (user.role === UserRole.Admin) {
            return sales;
        }
        return sales.filter(s => s.createdBy === user.username);
    }, [sales, user]);

    const renderAdminTabs = () => (
        <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`${
                        activeTab === 'sales'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    Ventas
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`${
                        activeTab === 'users'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    aria-current={activeTab === 'users' ? 'page' : undefined}
                >
                    Administrar Usuarios
                </button>
            </nav>
        </div>
    );

    const renderSalesView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <SalesForm onAddSale={onAddSale} user={user} />
            </div>
            <div>
                <FolioSearch sales={salesForCurrentUser} onSaleSelect={handleSelectSale} />
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Logo className="h-8 w-auto" />
                            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                Portal de Ventas SIAC
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Hola, {user.username} ({user.role})
                            </span>
                            <Button variant="secondary" onClick={onLogout}>
                                Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {selectedSale ? (
                    <SaleDetailView 
                        sale={selectedSale} 
                        onClose={handleCloseDetailView}
                        onUpdateSaleStatus={handleUpdateSaleStatus} 
                    />
                ) : (
                    <>
                        {user.role === UserRole.Admin && renderAdminTabs()}
                        {activeTab === 'sales' && renderSalesView()}
                        {activeTab === 'users' && user.role === UserRole.Admin && (
                            <UserManagement users={users} onAddUser={onAddUser} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;

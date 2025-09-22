import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SalesForm from './SalesForm';
import FolioSearch from './FolioSearch';
import Button from './ui/Button';
import { Sale, SaleStatus, User, UserRole } from '../types';
import SaleDetailView from './SaleDetailView';
import Logo from './ui/Logo';
import UserManagement from './admin/UserManagement';
import TeamView from './team/TeamView';

interface DashboardProps {
    user: User;
    onLogout: () => void;
    sales: Sale[];
    onAddSale: (newSale: Sale) => void;
    onUpdateSale: (updatedSale: Sale) => void;
    users: User[];
    onAddUser: (newUser: User) => void;
    onDeleteUser: (userId: string) => void;
}

type ActiveTab = 'sales' | 'users' | 'team';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, sales, onAddSale, onUpdateSale, users, onAddUser, onDeleteUser }) => {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('sales');
    
    useEffect(() => {
        const checkDailySales = () => {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const notificationKey = `notification_${user.username}_${todayStr}`;

            if (now.getHours() >= 19 && !localStorage.getItem(notificationKey)) {
                
                const salesToday = sales.filter(s => 
                    s.createdBy === user.username && s.captureDate === todayStr
                ).length;

                let message = '';
                if (salesToday === 0) {
                    message = '😭 No hoy fallamos, hoy fallamos';
                } else if (salesToday === 1) {
                    message = '😔 Chale';
                } else if (salesToday === 2) {
                    message = '😝 Suerte porque no me bañé';
                } else if (salesToday === 3) {
                    message = '🤩 Casi matraqueo LOVEERA TE AMA';
                } else if (salesToday >= 4) {
                    message = '🥳 Bien entonces La matraca.';
                }

                if (message) {
                    alert(message);
                    localStorage.setItem(notificationKey, 'shown');
                }
            }
        };

        checkDailySales();
    }, [sales, user.username]);

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
            if (selectedSale && selectedSale.id === saleId) {
                setSelectedSale(updatedSale);
            }
        }
    }, [sales, selectedSale, onUpdateSale]);

    const salesForCurrentUser = useMemo(() => {
        if (user.role === UserRole.Admin) {
            return sales;
        }
        return sales.filter(s => s.createdBy === user.username);
    }, [sales, user]);

    const renderTabs = () => {
        const tabData = user.role === UserRole.Admin 
            ? [{ id: 'sales', label: 'Ventas' }, { id: 'users', label: 'Administrar Usuarios' }]
            : [{ id: 'sales', label: 'Ventas' }, { id: 'team', label: 'Mi Equipo' }];

        return (
             <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabData.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ActiveTab)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-black text-black dark:border-white dark:text-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

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

    const renderContent = () => {
        switch(activeTab) {
            case 'sales':
                return renderSalesView();
            case 'users':
                return user.role === UserRole.Admin ? <UserManagement users={users} onAddUser={onAddUser} onDeleteUser={onDeleteUser} /> : null;
            case 'team':
                return user.role !== UserRole.Admin ? <TeamView currentUser={user} users={users} /> : null;
            default:
                return renderSalesView();
        }
    };


    return (
        <div className="min-h-screen">
            <header className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Logo className="h-8 w-auto" />
                            <h1 className="text-xl font-bold text-black dark:text-white">
                                Portal de Ventas SIAC
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-black dark:text-white truncate">{user.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.username} ({user.role})</p>
                            </div>
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
                        {renderTabs()}
                        {renderContent()}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
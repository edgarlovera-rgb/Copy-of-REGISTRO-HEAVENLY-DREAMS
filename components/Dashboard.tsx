import React, { useState, useCallback } from 'react';
import SalesForm from './SalesForm';
import FolioSearch from './FolioSearch';
import Button from './ui/Button';
import { Sale, SaleStatus } from '../types';
import SaleDetailView from './SaleDetailView';
import Logo from './ui/Logo';

interface DashboardProps {
    user: string;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const handleAddSale = useCallback((newSale: Sale) => {
        setSales(prevSales => [newSale, ...prevSales]);
    }, []);

    const handleSelectSale = useCallback((sale: Sale) => {
        setSelectedSale(sale);
    }, []);

    const handleCloseDetailView = useCallback(() => {
        setSelectedSale(null);
    }, []);
    
    const handleUpdateSaleStatus = useCallback((saleId: string, newStatus: SaleStatus) => {
        const newSales = sales.map(s => 
            s.id === saleId ? { ...s, status: newStatus } : s
        );
        setSales(newSales);
        
        // If the updated sale is the one being viewed, update the detail view state as well
        if (selectedSale && selectedSale.id === saleId) {
            const updatedSale = newSales.find(s => s.id === saleId);
            if (updatedSale) {
                setSelectedSale(updatedSale);
            }
        }

        alert('¡Estado de la venta actualizado!');
    }, [sales, selectedSale]);


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
                                Hola, {user}
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <SalesForm onAddSale={handleAddSale} />
                        </div>
                        <div>
                            <FolioSearch sales={sales} onSaleSelect={handleSelectSale} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
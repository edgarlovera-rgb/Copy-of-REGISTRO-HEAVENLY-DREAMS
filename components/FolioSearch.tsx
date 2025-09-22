
import React, { useState, useMemo } from 'react';
import { Sale, SaleStatus, ServiceType, PackageType } from '../types';
import { STATUS_COLORS } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface FolioSearchProps {
    sales: Sale[];
    onSaleSelect: (sale: Sale) => void;
}

const DocumentArrowDownIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const FolioCard: React.FC<{ sale: Sale; onSelect: () => void }> = ({ sale, onSelect }) => (
    <div 
        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
        aria-label={`Ver detalles del folio ${sale.folioSIAC}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-black dark:text-white">{sale.folioSIAC}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{sale.fullName}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[sale.status]}`}>
                {sale.status}
            </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
            {sale.captureDate} &bull; {sale.serviceType} &bull; {sale.packageType}
        </p>
        <p className="text-sm pt-1">{sale.selectedPackage}</p>
    </div>
);


const FolioSearch: React.FC<FolioSearchProps> = ({ sales, onSaleSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [filterService, setFilterService] = useState('');
    const [filterPackage, setFilterPackage] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterDate('');
        setFilterService('');
        setFilterPackage('');
        setFilterStatus('');
    };

    const filteredSales = useMemo(() => {
        let salesToShow = sales;

        if (!searchTerm && !filterDate && !filterService && !filterPackage && !filterStatus) {
            return salesToShow;
        }

        return salesToShow.filter(sale => {
            const searchTermLower = searchTerm.toLowerCase();
            if (searchTerm.trim() && !(sale.folioSIAC.toLowerCase().includes(searchTermLower) || sale.fullName.toLowerCase().includes(searchTermLower))) {
                return false;
            }
            if (filterDate && sale.captureDate !== filterDate) {
                return false;
            }
            if (filterService && sale.serviceType !== filterService) {
                return false;
            }
            if (filterPackage && sale.packageType !== filterPackage) {
                return false;
            }
            if (filterStatus && sale.status !== filterStatus) {
                return false;
            }
            return true;
        });
    }, [sales, searchTerm, filterDate, filterService, filterPackage, filterStatus]);

    const handleExportCSV = () => {
        if (filteredSales.length === 0) {
            alert('No hay ventas para exportar.');
            return;
        }

        const headers = [
            'ID', 'Nombre Completo', 'Teléfono', 'Fecha de Captura', 'Folio SIAC',
            'Tipo de Servicio', 'Tipo de Paquete', 'Paquete Seleccionado',
            'Tipo de Cliente', 'Tipo de Identificación', 'Estado', 'Registrado Por',
            'Archivo Folio SIAC', 'Archivo ID 1', 'Archivo ID 2',
            'Archivo Comprobante Domicilio', 'Archivo Portabilidad 1', 'Archivo Portabilidad 2'
        ];

        const rows = filteredSales.map(sale => {
            const rowData = [
                sale.id,
                sale.fullName,
                sale.phoneNumber,
                sale.captureDate,
                sale.folioSIAC,
                sale.serviceType,
                sale.packageType,
                sale.selectedPackage,
                sale.customerType,
                sale.idType,
                sale.status,
                sale.createdBy,
                sale.folioSIACFile?.name || '',
                sale.idFile1?.name || '',
                sale.idFile2?.name || '',
                sale.proofOfAddressFile?.name || '',
                sale.portabilityFile1?.name || '',
                sale.portabilityFile2?.name || ''
            ];
            // Escape quotes and wrap in double quotes
            return rowData.map(value => {
                const stringValue = String(value ?? '').replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        const today = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `reporte_ventas_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const serviceOptions = Object.values(ServiceType).map(s => ({ value: s, label: s }));
    const packageOptions = Object.values(PackageType).map(p => ({ value: p, label: p }));
    const statusOptions = Object.values(SaleStatus).map(s => ({ value: s, label: s }));


    return (
        <Card>
            <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Consultar Folios</h2>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? 'Ocultar Filtros' : 'Filtros Avanzados'}
                    </Button>
                    <Button variant="secondary" onClick={handleExportCSV} disabled={sales.length === 0} Icon={DocumentArrowDownIcon}>
                        Exportar a CSV
                    </Button>
                </div>
            </div>
            
            {showAdvanced && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-950 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="filterDate" label="Fecha de Captura" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                        <Select id="filterService" label="Tipo de Servicio" options={serviceOptions} value={filterService} onChange={(e) => setFilterService(e.target.value)} />
                        <Select id="filterPackage" label="Tipo de Paquete" options={packageOptions} value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)} />
                        <Select id="filterStatus" label="Estado" options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="secondary" onClick={handleClearFilters}>Limpiar Filtros</Button>
                    </div>
                </div>
            )}

            <Input
                id="search"
                label="Buscar por Folio SIAC o Nombre"
                placeholder="Escriba para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="mt-6">
                {sales.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No hay ventas registradas todavía.</p>
                    </div>
                ) : filteredSales.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {filteredSales.map(sale => (
                           <FolioCard key={sale.id} sale={sale} onSelect={() => onSaleSelect(sale)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No se encontraron resultados para los filtros aplicados.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FolioSearch;
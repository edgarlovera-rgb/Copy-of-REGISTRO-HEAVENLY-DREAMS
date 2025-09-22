import React, { useState, useEffect } from 'react';
import { Sale, SaleStatus, CustomerType, IdType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Select from './ui/Select';
import { STATUS_COLORS } from '../constants';

interface SaleDetailViewProps {
    sale: Sale;
    onClose: () => void;
    onUpdateSaleStatus: (saleId: string, newStatus: SaleStatus) => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const FileInfo: React.FC<{ label: string; file?: File }> = ({ label, file }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);

            // Clean up the object URL when the component unmounts or the file changes
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setFileUrl(null);
        }
    }, [file]);

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!file || !fileUrl) return;

        // Define file types that are safe to open directly in the browser
        const viewableTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        if (viewableTypes.includes(file.type)) {
            event.preventDefault(); // Prevent the default download behavior
            window.open(fileUrl, '_blank', 'noopener,noreferrer'); // Open in a new tab
        }
        // For other file types, the default browser behavior (download) will proceed.
    };

    return (
        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
            <div className="w-0 flex-1 flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 flex-1 w-0 truncate">{label}</span>
            </div>
            <div className="ml-4 flex-shrink-0">
                {file && fileUrl ? (
                    <a
                        href={fileUrl}
                        download={file.name}
                        onClick={handleLinkClick}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors inline-flex items-center"
                        aria-label={`Ver o descargar ${label}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar
                    </a>
                ) : (
                    <span className="font-medium text-slate-500 dark:text-slate-400">No adjuntado</span>
                )}
            </div>
        </li>
    );
};


const SaleDetailView: React.FC<SaleDetailViewProps> = ({ sale, onClose, onUpdateSaleStatus }) => {
    const [currentStatus, setCurrentStatus] = useState<SaleStatus>(sale.status);

    useEffect(() => {
        // Reset local status if the sale prop changes (e.g., viewing another sale)
        setCurrentStatus(sale.status);
    }, [sale]);

    const handleSaveChanges = () => {
        onUpdateSaleStatus(sale.id, currentStatus);
    };

    const hasChanges = currentStatus !== sale.status;

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Detalle de Venta</h2>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{sale.folioSIAC}</p>
                </div>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700">
                <dl>
                    <DetailRow label="Nombre Completo" value={sale.fullName} />
                    <DetailRow label="Fecha de Captura" value={sale.captureDate} />
                    <DetailRow label="Estado Actual" value={
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[sale.status]}`}>
                            {sale.status}
                        </span>
                    } />
                    <DetailRow label="Tipo de Servicio" value={sale.serviceType} />
                    <DetailRow label="Tipo de Paquete" value={sale.packageType} />
                    <DetailRow label="Paquete Contratado" value={sale.selectedPackage} />
                    <DetailRow label="Tipo de Cliente" value={sale.customerType} />
                    <DetailRow label="Tipo de Identificación" value={sale.idType} />
                </dl>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                 <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Actualizar Estado</h3>
                 <div className="flex items-end gap-4">
                    <div className="flex-grow">
                        <Select 
                            id="saleStatus"
                            label="Nuevo Estado"
                            options={Object.values(SaleStatus)}
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value as SaleStatus)}
                        />
                    </div>
                    <Button 
                        onClick={handleSaveChanges} 
                        disabled={!hasChanges}
                    >
                        Guardar Cambios
                    </Button>
                 </div>
            </div>

             <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Archivos Adjuntos</h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-md">
                    <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
                        <FileInfo label="Captura del Folio SIAC" file={sale.folioSIACFile} />
                        {sale.idType === IdType.INE ? (
                            <>
                                <FileInfo label="Identificación (INE) - Frente" file={sale.idFile1} />
                                <FileInfo label="Identificación (INE) - Reverso" file={sale.idFile2} />
                            </>
                        ) : (
                           <FileInfo label="Identificación (CURP)" file={sale.idFile1} />
                        )}
                        <FileInfo label="Comprobante de Domicilio" file={sale.proofOfAddressFile} />
                        {sale.customerType === CustomerType.Portabilidad && (
                            <>
                                <FileInfo label="Anexo de Portabilidad 1" file={sale.portabilityFile1} />
                                <FileInfo label="Anexo de Portabilidad 2" file={sale.portabilityFile2} />
                            </>
                        )}
                    </ul>
                </div>
            </div>

        </Card>
    );
};

export default SaleDetailView;
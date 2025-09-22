import React, { useState, useEffect } from 'react';
import { Sale, SaleStatus, CustomerType, IdType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Select from './ui/Select';
import { STATUS_COLORS } from '../constants';

declare const JSZip: any;

interface SaleDetailViewProps {
    sale: Sale;
    onClose: () => void;
    onUpdateSaleStatus: (saleId: string, newStatus: SaleStatus) => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const FileInfo: React.FC<{ label: string; file?: File }> = ({ label, file }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setFileUrl(null);
        }
    }, [file]);

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!file || !fileUrl) return;
        const viewableTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (viewableTypes.includes(file.type)) {
            event.preventDefault();
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
            <div className="w-0 flex-1 flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                        className="font-medium text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors inline-flex items-center underline"
                        aria-label={`Ver o descargar ${label}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar
                    </a>
                ) : (
                    <span className="font-medium text-gray-500 dark:text-gray-400">No adjuntado</span>
                )}
            </div>
        </li>
    );
};

const DocumentArrowDownIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const SaleDetailView: React.FC<SaleDetailViewProps> = ({ sale, onClose, onUpdateSaleStatus }) => {
    const [currentStatus, setCurrentStatus] = useState<SaleStatus>(sale.status);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setCurrentStatus(sale.status);
    }, [sale]);

    const handleSaveChanges = () => {
        setIsSaving(true);
        onUpdateSaleStatus(sale.id, currentStatus);
        setTimeout(() => setIsSaving(false), 2000); // Show "Guardado!" for 2 seconds
    };

    const hasChanges = currentStatus !== sale.status && !isSaving;

    const handleDownloadAllFiles = async () => {
        if (typeof JSZip === 'undefined') {
            alert('La librería para comprimir archivos no está disponible. Por favor, recargue la página.');
            return;
        }

        const zip = new JSZip();
        const filesToZip: { file: File, name: string }[] = [];
        const folio = sale.folioSIAC.replace(/[^a-z0-9]/gi, '_') || 'SIN_FOLIO';

        const addFileToList = (file: File | undefined, baseName: string) => {
            if (file) {
                const extension = file.name.split('.').pop() || 'file';
                filesToZip.push({ file, name: `${folio}_${baseName}.${extension}` });
            }
        };

        addFileToList(sale.folioSIACFile, 'FolioSIAC');
        if (sale.idType === IdType.INE) {
            addFileToList(sale.idFile1, 'INE_Frente');
            addFileToList(sale.idFile2, 'INE_Reverso');
        } else {
            addFileToList(sale.idFile1, 'CURP');
        }
        addFileToList(sale.proofOfAddressFile, 'Comprobante_Domicilio');
        if (sale.customerType === CustomerType.Portabilidad) {
            addFileToList(sale.portabilityFile1, 'Portabilidad_1');
            addFileToList(sale.portabilityFile2, 'Portabilidad_2');
        }
        
        if (filesToZip.length === 0) {
            alert('No hay archivos adjuntos para descargar.');
            return;
        }

        for (const { file, name } of filesToZip) {
            zip.file(name, file);
        }

        try {
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Folio_${folio}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error creating zip file:', error);
            alert('Ocurrió un error al generar el archivo .zip.');
        }
    };
    
    const hasFiles = [
      sale.folioSIACFile,
      sale.idFile1,
      sale.idFile2,
      sale.proofOfAddressFile,
      sale.portabilityFile1,
      sale.portabilityFile2
    ].some(file => !!file);

    const statusOptions = Object.values(SaleStatus).map(s => ({ value: s, label: s }));

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">Detalle de Venta</h2>
                    <p className="text-black dark:text-white font-semibold">{sale.folioSIAC}</p>
                </div>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800">
                <dl>
                    <DetailRow label="Nombre Completo" value={sale.fullName} />
                    <DetailRow label="Teléfono" value={sale.phoneNumber} />
                    <DetailRow label="Fecha de Captura" value={sale.captureDate} />
                    <DetailRow label="Registrado por" value={sale.createdBy} />
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
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                 <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Actualizar Estado</h3>
                 <div className="flex items-end gap-4">
                    <div className="flex-grow">
                        <Select 
                            id="saleStatus"
                            label="Nuevo Estado"
                            options={statusOptions}
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value as SaleStatus)}
                        />
                    </div>
                    <Button 
                        onClick={handleSaveChanges} 
                        disabled={!hasChanges}
                        className="min-w-[140px]"
                    >
                        {isSaving ? '¡Guardado!' : 'Guardar Cambios'}
                    </Button>
                 </div>
            </div>

             <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-black dark:text-white">Archivos Adjuntos</h3>
                    {hasFiles && (
                         <Button 
                            onClick={handleDownloadAllFiles} 
                            variant="secondary"
                            Icon={DocumentArrowDownIcon}
                        >
                            Descargar Todo
                        </Button>
                    )}
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-md">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
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
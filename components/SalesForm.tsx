
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Sale, ServiceType, PackageType, CustomerType, IdType, SaleStatus, User } from '../types';
import { PACKAGE_OPTIONS } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import RadioGroup from './ui/RadioGroup';
import Button from './ui/Button';
import FileInput from './ui/FileInput';

interface SalesFormProps {
    onAddSale: (sale: Sale) => void;
    user: User;
}

const SalesForm: React.FC<SalesFormProps> = ({ onAddSale, user }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [captureDate, setCaptureDate] = useState(new Date().toISOString().split('T')[0]);
    const [folioSIAC, setFolioSIAC] = useState('');
    const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.Residencial);
    const [packageType, setPackageType] = useState<PackageType>(PackageType.DoblePlay);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [customerType, setCustomerType] = useState<CustomerType>(CustomerType.LineaNueva);
    const [idType, setIdType] = useState<IdType>(IdType.INE);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    // File states
    const [folioSIACFile, setFolioSIACFile] = useState<File | null>(null);
    const [idFile1, setIdFile1] = useState<File | null>(null);
    const [idFile2, setIdFile2] = useState<File | null>(null);
    const [proofOfAddressFile, setProofOfAddressFile] = useState<File | null>(null);
    const [portabilityFile1, setPortabilityFile1] = useState<File | null>(null);
    const [portabilityFile2, setPortabilityFile2] = useState<File | null>(null);

    const packageOptions = useMemo(() => {
        const packages = PACKAGE_OPTIONS[serviceType]?.[packageType] || [];
        return packages.map(pkg => ({ value: pkg, label: pkg }));
    }, [serviceType, packageType]);

    const resetForm = useCallback(() => {
        setFullName('');
        setPhoneNumber('');
        setCaptureDate(new Date().toISOString().split('T')[0]);
        setFolioSIAC('');
        setServiceType(ServiceType.Residencial);
        setPackageType(PackageType.DoblePlay);
        setSelectedPackage('');
        setCustomerType(CustomerType.LineaNueva);
        setIdType(IdType.INE);
        setFolioSIACFile(null);
        setIdFile1(null);
        setIdFile2(null);
        setProofOfAddressFile(null);
        setPortabilityFile1(null);
        setPortabilityFile2(null);
        setErrors({});
        formRef.current?.reset();
    }, []);

    const handleIdTypeChange = (newIdType: IdType) => {
        setIdType(newIdType);
        setIdFile1(null);
        setIdFile2(null);
    };

    const handleCustomerTypeChange = (newCustomerType: CustomerType) => {
        setCustomerType(newCustomerType);
        if (newCustomerType !== CustomerType.Portabilidad) {
            setPortabilityFile1(null);
            setPortabilityFile2(null);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            newErrors.fullName = 'El nombre solo debe contener letras y espacios.';
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'El número de teléfono debe tener exactamente 10 dígitos.';
        }
        if (!/^\d+$/.test(folioSIAC)) {
            newErrors.folioSIAC = 'El Folio SIAC solo debe contener números.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const newSale: Sale = {
            id: crypto.randomUUID(),
            fullName,
            phoneNumber,
            captureDate,
            folioSIAC,
            serviceType,
            packageType,
            selectedPackage,
            customerType,
            idType,
            status: SaleStatus.Pendiente,
            createdBy: user.username,
            folioSIACFile: folioSIACFile || undefined,
            idFile1: idFile1 || undefined,
            idFile2: idType === IdType.INE ? (idFile2 || undefined) : undefined,
            proofOfAddressFile: proofOfAddressFile || undefined,
            portabilityFile1: customerType === CustomerType.Portabilidad ? (portabilityFile1 || undefined) : undefined,
            portabilityFile2: customerType === CustomerType.Portabilidad ? (portabilityFile2 || undefined) : undefined,
        };
        onAddSale(newSale);
        alert(`Folio SIAC ${folioSIAC} registrado con éxito!`);
        resetForm();
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Registrar Nueva Venta</h2>
            <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Input id="fullName" label="Nombre y Apellido" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <Input id="phoneNumber" label="Teléfono (10 dígitos)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required maxLength={10} />
                        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <Input id="captureDate" label="Fecha de Captura" type="date" value={captureDate} onChange={(e) => setCaptureDate(e.target.value)} required />
                    <div>
                        <Input id="folioSIAC" label="Folio SIAC" value={folioSIAC} onChange={(e) => setFolioSIAC(e.target.value)} required />
                        {errors.folioSIAC && <p className="text-sm text-red-500 mt-1">{errors.folioSIAC}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <RadioGroup label="Tipo de Servicio" name="serviceType" options={Object.values(ServiceType)} selectedValue={serviceType} onChange={(v) => { setServiceType(v); setSelectedPackage(''); }} />
                    <RadioGroup label="Tipo de Paquete" name="packageType" options={Object.values(PackageType)} selectedValue={packageType} onChange={(v) => { setPackageType(v); setSelectedPackage(''); }} />
                </div>

                <Select id="selectedPackage" label="Paquete" options={packageOptions} value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} required />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <RadioGroup label="Tipo de Cliente" name="customerType" options={Object.values(CustomerType)} selectedValue={customerType} onChange={handleCustomerTypeChange} />
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Carga de Documentos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileInput id="folioSIACFile" label="Captura del Folio SIAC" value={folioSIACFile} onChange={setFolioSIACFile} />
                      
                      <div className="space-y-4">
                        <RadioGroup label="Tipo de Identificación" name="idType" options={Object.values(IdType)} selectedValue={idType} onChange={handleIdTypeChange} />
                        {idType === IdType.INE && (
                          <>
                            <FileInput id="idFile1" label="INE (Frente)" value={idFile1} onChange={setIdFile1} />
                            <FileInput id="idFile2" label="INE (Reverso)" value={idFile2} onChange={setIdFile2} />
                          </>
                        )}
                        {idType === IdType.CURP && (
                            <FileInput id="idFile1" label="CURP" value={idFile1} onChange={setIdFile1} />
                        )}
                      </div>
                      
                      <FileInput id="proofOfAddress" label="Comprobante de Domicilio" optional value={proofOfAddressFile} onChange={setProofOfAddressFile} />

                      {customerType === CustomerType.Portabilidad && (
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FileInput id="portabilityFile1" label="Anexo de Portabilidad 1" value={portabilityFile1} onChange={setPortabilityFile1} />
                          <FileInput id="portabilityFile2" label="Anexo de Portabilidad 2" value={portabilityFile2} onChange={setPortabilityFile2} />
                        </div>
                      )}
                  </div>
                </div>

                <div className="pt-6 text-right">
                    <Button type="submit">
                        Registrar Folio SIAC
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default SalesForm;
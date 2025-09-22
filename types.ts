
export enum ServiceType {
  Residencial = 'Residencial',
  Negocio = 'Negocio',
}

export enum PackageType {
  DoblePlay = 'Doble Play',
  SoloInternet = 'Solo Internet',
}

export enum CustomerType {
  LineaNueva = 'Linea Nueva',
  Portabilidad = 'Portabilidad',
  Winback = 'Winback',
  LineaSola = 'Linea Sola',
}

export enum IdType {
  INE = 'INE',
  CURP = 'CURP',
}

export enum SaleStatus {
    Pendiente = 'Pendiente',
    Cancelado = 'Cancelado',
    Posteado = 'Posteado',
    ProcesoInstalacion = 'Proceso de Instalación',
}

export interface Sale {
  id: string;
  fullName: string;
  captureDate: string;
  folioSIAC: string;
  serviceType: ServiceType;
  packageType: PackageType;
  selectedPackage: string;
  customerType: CustomerType;
  idType: IdType;
  status: SaleStatus;
  createdBy: string;
  folioSIACFile?: File;
  idFile1?: File;
  idFile2?: File;
  proofOfAddressFile?: File;
  portabilityFile1?: File;
  portabilityFile2?: File;
}

export enum UserRole {
    Admin = 'Administrador',
    Capacitacion = 'Persona en Capacitación',
    Asesor = 'Asesor',
    Supervisor = 'Supervisor',
}

export interface User {
    id: string;
    username: string; // This will be the 8-digit key for non-admin users
    password?: string;
    role: UserRole;
}
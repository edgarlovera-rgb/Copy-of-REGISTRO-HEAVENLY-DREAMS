
import { ServiceType, PackageType, SaleStatus } from './types';

type PackageOptions = {
    [key in ServiceType]: {
        [key in PackageType]: string[];
    };
};

export const PACKAGE_OPTIONS: PackageOptions = {
    [ServiceType.Residencial]: {
        [PackageType.DoblePlay]: [
            'Doble Play $389 - 80 Megas',
            'Doble Play $435 - 100 Megas',
            'Doble Play $499 - 150 Megas',
            'Doble Play $599 - 250 Megas',
            'Doble Play $649 - 350 Megas',
            'Doble Play $725 - 500 Megas',
            'Doble Play $1399 - 1000 Megas',
        ],
        [PackageType.SoloInternet]: [
            'Solo Internet $349 - 80 Megas',
            'Solo Internet $399 - 100 Megas',
            'Solo Internet $449 - 150 Megas',
            'Solo Internet $549 - 350 Megas',
            'Solo Internet $649 - 500 Megas',
        ]
    },
    [ServiceType.Negocio]: {
        [PackageType.DoblePlay]: [
            'Infinitum Negocio $399 - 80 Megas',
            'Infinitum Negocio $549 - 150 Megas',
            'Infinitum Negocio $649 - 250 Megas',
            'Infinitum Negocio $799 - 350 Megas',
            'Infinitum Negocio $999 - 500 Megas',
            'Infinitum Negocio $1,499 - 750 Megas (2 líneas)',
            'Infinitum Negocio $1,789 - 750 Megas (4 líneas)',
            'Infinitum Negocio $2,289 - 1000 Megas',
        ],
        [PackageType.SoloInternet]: [
            'Solo Internet $349 - 80 Megas',
            'Solo Internet $399 - 100 Megas',
            'Solo Internet $449 - 150 Megas',
            'Solo Internet $499 - 250 Megas',
            'Solo Internet $549 - 350 Megas',
            'Solo Internet $649 - 500 Megas',
            'Solo Internet $899 - 750 Megas',
        ]
    }
};

export const STATUS_COLORS: { [key in SaleStatus]: string } = {
    [SaleStatus.Pendiente]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [SaleStatus.Cancelado]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    [SaleStatus.Posteado]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [SaleStatus.ProcesoInstalacion]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
};

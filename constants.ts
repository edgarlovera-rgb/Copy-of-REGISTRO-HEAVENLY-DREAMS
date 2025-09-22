
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
    [SaleStatus.Pendiente]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [SaleStatus.Cancelado]: 'bg-gray-800 text-white dark:bg-gray-300 dark:text-black',
    [SaleStatus.Posteado]: 'bg-black text-white dark:bg-white dark:text-black',
    [SaleStatus.ProcesoInstalacion]: 'bg-gray-400 text-black dark:bg-gray-500 dark:text-white',
};
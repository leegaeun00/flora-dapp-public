import { contractAddresses } from './contractAddresses';
export const getEtfList = () =>
{
    return [
        {
            //KUSDT-KDAI, KETH-KUSDT, ACA-KUSDT
            id: 'Etf1',
            label: 'ETF 1',
            tokenLabel: 'KUSDT',
            profitLabel: ['KUSDT-KDAI', 'KETH-KUSDT', 'ACA-KUSDT'],
            tokenAddr: contractAddresses.Kusdt,
            etfAddr: contractAddresses.Etf1,
        },
        {
            //KSP-KUSDT, KORC-KUSDT, ACA-KUSDT
            id: 'Etf2',
            label: 'ETF 2',
            tokenLabel: 'KUSDT',
            profitLabel: ['KSP-KUSDT', 'KORC-KUSDT', 'ACA-KUSDT'],
            tokenAddr: contractAddresses.Kusdt,
            etfAddr: contractAddresses.Etf2,
        },
        {
            //KUSDT-KUSDC, KXRP-KUSDT, ACA-KUSDT
            id: 'Etf3',
            label: 'ETF 3',
            tokenLabel: 'KUSDT',
            profitLabel: ['KUSDT-KUSDC', 'KXRP-KUSDT', 'ACA-KUSDT'],
            tokenAddr: contractAddresses.Kusdt,
            etfAddr: contractAddresses.Etf3,
        }
    ]
}
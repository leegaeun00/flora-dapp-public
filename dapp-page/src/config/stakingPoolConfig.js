import { contractAddresses } from './contractAddresses';
export const getPoolList = () =>
{
    return [
        {
            id: 'AcaPool10',
            label: 'Acacia (ACA) Pool',
            tokenLabel: 'ACA',
            profitLabel: 'ACA',
            tokenAddr: contractAddresses.Aca,
            poolAddr: contractAddresses.AcaPool,
            category: 'onlyAca',
            lockup: '10 days',
            //may need to add token image
        },
        {
            id: 'AcaPool30',
            label: 'Acacia (ACA) Pool',
            tokenLabel: 'ACA',
            profitLabel: 'ACA',
            tokenAddr: contractAddresses.Aca,
            poolAddr: contractAddresses.AcaPool,
            category: 'onlyAca',
            lockup: '30 days',
            //may need to add token image
        },
        {
            id: 'AcaPool90',
            label: 'Acacia (ACA) Pool',
            tokenLabel: 'ACA',
            profitLabel: 'ACA',
            tokenAddr: contractAddresses.Aca,
            poolAddr: contractAddresses.AcaPool,
            category: 'onlyAca',
            lockup: '90 days',
            //may need to add token image
        },
        {
            id: 'KlayAcaLpPool',
            label: 'KLAY-ACA LP Pool',
            tokenLabel: 'KLAY-ACA',
            profitLabel: 'KLAY-ACA',
            tokenAddr: contractAddresses.KlayAca,
            poolAddr: contractAddresses.KlayAcaLpPool,
            category: 'lpWithAca',
            lockup: '0 days',
        },
        {
            id: 'KlayKspLpPool',
            label: 'KLAY-KSP LP Pool',
            tokenLabel: 'KLAY-KSP',
            profitLabel: 'KLAY-KSP',
            tokenAddr: contractAddresses.KlayKsp,
            poolAddr: contractAddresses.KlayKspLpPool,
            category: 'lpWithoutAca',
            lockup: '0 days',
        },
        {
            id: 'KusdtAcaLpPool',
            label: 'KUSDT-ACA LP Pool',
            tokenLabel: 'KUSDT-ACA',
            profitLabel: 'KUSDT-ACA',
            tokenAddr: contractAddresses.KusdtAca,
            poolAddr: contractAddresses.KusdtAcaLpPool,
            category: 'lpWithAca',
            lockup: '0 days',
        },
        {
            id: 'KusdtKdaiLpPool',
            label: 'KUSDT-KDAI LP Pool',
            tokenLabel: 'KUSDT-KDAI',
            profitLabel: 'KUSDT-KDAI',
            tokenAddr: contractAddresses.KusdtKdai,
            poolAddr: contractAddresses.KusdtKdaiLpPool,
            category: 'lpWithoutAca',
            lockup: '0 days'
        },
    ]
}
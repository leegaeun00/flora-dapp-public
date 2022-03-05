import { contractAddresses } from './contractAddresses';
export const getPoolList = () =>
{
    return [
        {
            id: 'KusdtKdaiLpPool',
            label: 'KUSDT-KDAI LP Pool',
            tokenLabel: 'KUSDT-KDAI',
            profitLabel: ['ACA'],
            // twoTokenProfit: false,
            decimals: 18,
            tokenAddr: contractAddresses.KusdtKdai,
            poolAddr: contractAddresses.KusdtKdaiLpPool,
            dashboardAddr: '',
        },
    ]
}
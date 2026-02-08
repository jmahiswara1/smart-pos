import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp
} from 'lucide-react';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentSales from '../components/dashboard/RecentSales';
import SlideTransition from '../components/ui/SlideTransition';
import StatsCard from '../components/dashboard/StatsCard';

import TopProducts from '../components/dashboard/TopProducts';
import StockAlerts from '../components/dashboard/StockAlerts';

export default function DashboardPage() {
    // Fetch transaction statistics
    const { data: transactionStats, isLoading: txLoading } = useQuery({
        queryKey: ['transaction-stats'],
        queryFn: async () => {
            const { data } = await api.get('/transactions/stats');
            return data;
        },
        refetchInterval: 5000 // Poll every 5 seconds for real-time updates
    });

    // Fetch customer statistics
    const { data: customerStats, isLoading: custLoading } = useQuery({
        queryKey: ['customer-stats'],
        queryFn: async () => {
            const { data } = await api.get('/customers/stats');
            return data;
        },
        refetchInterval: 5000
    });

    // Fetch product statistics
    const { data: productStats, isLoading: prodLoading } = useQuery({
        queryKey: ['product-stats'],
        queryFn: async () => {
            const { data } = await api.get('/products/stats');
            return data;
        },
        refetchInterval: 5000
    });

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });

    return (
        <SlideTransition className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h2>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={transactionStats?.totalRevenue || 0}
                    formattedValue={formatter.format(transactionStats?.totalRevenue || 0)}
                    icon={DollarSign}
                    description="Total sales revenue"
                    isLoading={txLoading}
                />
                <StatsCard
                    title="Total Profit"
                    value={transactionStats?.totalProfit || 0}
                    formattedValue={formatter.format(transactionStats?.totalProfit || 0)}
                    icon={TrendingUp}
                    description="Gross profit (Rev - Cost)"
                    isLoading={txLoading}
                />

                {/* Global Stats */}
                <StatsCard
                    title="Total Transactions"
                    value={transactionStats?.totalTransactions || 0}
                    icon={ShoppingCart}
                    description="All time orders"
                    isLoading={txLoading}
                />
                <StatsCard
                    title="Total Customers"
                    value={customerStats?.totalCustomers || 0}
                    icon={Users}
                    description="Registered customers"
                    isLoading={custLoading}
                />

                {/* Today's Stats */}
                <StatsCard
                    title="Today's Revenue"
                    value={transactionStats?.todayRevenue || 0}
                    formattedValue={formatter.format(transactionStats?.todayRevenue || 0)}
                    icon={DollarSign}
                    description="Revenue today"
                    isLoading={txLoading}
                />
                <StatsCard
                    title="Today's Transactions"
                    value={transactionStats?.todayTransactions || 0}
                    icon={ShoppingCart}
                    description="Orders today"
                    isLoading={txLoading}
                />
                <StatsCard
                    title="Today's Products"
                    value={transactionStats?.todayProductSold || 0}
                    icon={Package}
                    description="Items sold today"
                    isLoading={txLoading}
                />
                <StatsCard
                    title="Total Products"
                    value={productStats?.total || 0}
                    icon={Package}
                    description={`${productStats?.totalStock || 0} items in stock`}
                    isLoading={prodLoading}
                />
            </div>

            {/* Revenue Chart and Recent Sales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Revenue Overview</h3>
                    </div>
                    <RevenueChart />
                </div>
                <div className="col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Recent Sales</h3>
                        <p className="text-sm text-gray-500">Latest transactions</p>
                    </div>
                    <RecentSales />
                </div>
            </div>

            {/* Top Products and Stock Alerts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4 h-full">
                    <TopProducts />
                </div>
                <div className="lg:col-span-3 h-full">
                    <StockAlerts />
                </div>
            </div>
        </SlideTransition>
    );
}

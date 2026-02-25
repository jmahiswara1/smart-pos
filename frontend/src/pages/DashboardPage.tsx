import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    Wallet,
    Receipt,
    Activity
} from 'lucide-react';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentSales from '../components/dashboard/RecentSales';
import SlideTransition from '../components/ui/SlideTransition';
import { cn } from '../lib/utils';
import TopProducts from '../components/dashboard/TopProducts';
import StockAlerts from '../components/dashboard/StockAlerts';

// Custom Stats Card Component for Dashboard
const GlassStatsCard = ({ title, value, icon: Icon, trend, trendValue, color, isLoading, description }: any) => {
    return (
        <div className="glass p-5 rounded-2xl flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
                    {isLoading ? (
                        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                    ) : (
                        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
                    )}
                </div>
                <div className={cn("p-2 rounded-xl transition-colors",
                    color === 'primary' ? "bg-gray-100 dark:bg-gray-800 text-primary dark:text-white" :
                        color === 'green' ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                            color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
                                "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {description && (
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mt-auto">
                    <span>{description}</span>
                </div>
            )}
            {/* Trend Placeholder - logic can be improved with real data */}
            {trend && (
                <div className={cn("flex items-center gap-1 text-xs font-medium mt-auto",
                    trend === 'up' ? "text-green-600" : "text-rose-500"
                )}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{trendValue} vs last week</span>
                </div>
            )}
        </div>
    );
};

export default function DashboardPage() {
    // Fetch transaction statistics
    const { data: transactionStats, isLoading: txLoading } = useQuery({
        queryKey: ['transaction-stats'],
        queryFn: async () => {
            const { data } = await api.get('/transactions/stats');
            return data;
        },
        refetchInterval: 5000
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
        <SlideTransition className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
            </header>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassStatsCard
                    title="Total Revenue"
                    value={formatter.format(transactionStats?.totalRevenue || 0)}
                    icon={DollarSign}
                    description="Total sales revenue"
                    color="primary"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Total Profit"
                    value={formatter.format(transactionStats?.totalProfit || 0)}
                    icon={Wallet}
                    trend="up"
                    trendValue="+8.2%"
                    color="green"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Transactions"
                    value={transactionStats?.totalTransactions || 0}
                    icon={Receipt}
                    trend="down"
                    trendValue="-2.1%"
                    color="primary"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Total Customers"
                    value={customerStats?.totalCustomers || 0}
                    icon={Users}
                    trend="up"
                    trendValue="+18%"
                    color="green"
                    isLoading={custLoading}
                />

                {/* Secondary Row of Stats */}
                <GlassStatsCard
                    title="Today's Revenue"
                    value={formatter.format(transactionStats?.todayRevenue || 0)}
                    icon={Activity}
                    description="Revenue generated today"
                    color="blue"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Today's Transactions"
                    value={transactionStats?.todayTransactions || 0}
                    icon={ShoppingCart}
                    description="Orders processed today"
                    color="primary"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Products Sold Today"
                    value={transactionStats?.todayProductSold || 0}
                    icon={Package}
                    description="Items sold today"
                    color="primary"
                    isLoading={txLoading}
                />
                <GlassStatsCard
                    title="Total Products"
                    value={productStats?.total || 0}
                    icon={Package}
                    description={`${productStats?.totalStock || 0} total items in stock`}
                    color="primary"
                    isLoading={prodLoading}
                />
            </div>

            {/* Revenue Chart Section */}
            <section className="glass rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Revenue Overview</h2>
                </div>
                <div className="h-[300px] w-full">
                    <RevenueChart />
                </div>
            </section>

            {/* Bottom Grid: Recent Transactions & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
                        <a href="/transactions" className="text-sm text-primary font-medium hover:underline">View All</a>
                    </div>
                    <RecentSales />
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Top Products</h2>
                        </div>
                        <TopProducts />
                    </div>
                    <div className="glass rounded-2xl p-6 shadow-sm border border-rose-100 dark:border-rose-900/30">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                Stock Alerts
                            </h2>
                        </div>
                        <StockAlerts />
                    </div>
                </div>
            </div>
        </SlideTransition>
    );
}

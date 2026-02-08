import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Package } from 'lucide-react';

interface TopProduct {
    productId: string;
    name: string;
    image: string | null;
    category: string;
    price: number;
    totalSold: number;
    totalRevenue: number;
}

export default function TopProducts() {
    const { data: topProducts, isLoading } = useQuery<TopProduct[]>({
        queryKey: ['top-products'],
        queryFn: async () => {
            const { data } = await api.get('/transactions/top-selling-today');
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 h-full animate-pulse">
                <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 w-full bg-gray-100 dark:bg-slate-700 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Top Selling Today
                </h3>
            </div>

            <div className="space-y-4">
                {topProducts && topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                        <div key={product.productId} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-900/50 rounded-lg transition-colors group">
                            <div className="relative font-bold text-lg text-gray-400 w-6 text-center">
                                #{index + 1}
                            </div>
                            <div className="h-12 w-12 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 border dark:border-slate-600">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        <Package className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{product.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white">{product.totalSold} sold</p>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">+Rp {product.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No sales yet today</p>
                    </div>
                )}
            </div>
        </div>
    );
}

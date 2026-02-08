import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { PackageX, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    category: { name: string };
    stock: number;
    image: string | null;
}

export default function StockAlerts() {
    const { data, isLoading } = useQuery<{ data: Product[], meta: any }>({
        queryKey: ['out-of-stock'],
        queryFn: async () => {
            const { data } = await api.get('/products?stockLevel=out&limit=5');
            return data;
        },
    });

    const outOfStockProducts = data?.data || [];

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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Out of Stock Alerts
                </h3>
            </div>

            <div className="space-y-4 flex-1">
                {outOfStockProducts.length > 0 ? (
                    outOfStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg group">
                            <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border dark:border-slate-700 flex items-center justify-center">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <PackageX className="w-5 h-5 text-red-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.category?.name}</p>
                            </div>
                            <div className="px-3 py-1 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                                0 Stock
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 text-green-600 dark:text-green-400">
                        <div className="p-3 rounded-full mb-3">
                            <PackageX className="w-8 h-8" />
                        </div>
                        <p className="font-medium">All items in stock!</p>
                    </div>
                )}
            </div>

            {outOfStockProducts.length > 0 && (
                <div className="mt-6 pt-4 border-t dark:border-slate-700">
                    <Link to="/products" className="flex items-center justify-center w-full gap-2 text-sm font-medium text-primary hover:underline">
                        Manage Inventory <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}

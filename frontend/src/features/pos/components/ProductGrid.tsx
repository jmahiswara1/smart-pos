import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { useCart } from '../hooks/useCart';
import { formatRupiah } from '../../../lib/utils';
import type { Product, Category } from '../../../types';
import { Search, Package } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function ProductGrid() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const addItem = useCart((state) => state.addItem);

    // Fetch Products
    const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
        queryKey: ['pos-products'],
        queryFn: async () => {
            const { data } = await api.get('/products?limit=100&isActive=true');
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        },
    });

    // Fetch Categories
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['pos-categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories');
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        },
    });

    const filteredProducts = products
        ?.filter((p) => p.isActive)
        .filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });



    return (
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-slate-900 transition-colors">
            {/* Search & Filter Header */}
            <div className="p-4 bg-white dark:bg-slate-950 border-b dark:border-slate-800 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-gray-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === null
                            ? 'bg-black dark:bg-white text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        All Items
                    </button>
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-black dark:bg-white text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                {productsLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-32 w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-center">
                        <Package className="h-12 w-12 mb-2 opacity-20" />
                        <p>No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-4">
                        {filteredProducts?.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => product.stock > 0 && addItem(product)}
                                className={`group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/20 cursor-pointer transition-all overflow-hidden flex flex-col ${product.stock === 0 ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
                            >
                                <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-900 relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <Package className="h-10 w-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs shadow-sm">
                                            {product.stock}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">{product.name}</h3>
                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{formatRupiah(product.price)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

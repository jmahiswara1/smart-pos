import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Product, PaginatedResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '../components/ui/Table';
import { Pencil, Trash2, Search, Plus, Package, Filter, BarChart3, Tag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog } from '../components/ui/Dialog';
import ProductForm from '../components/products/ProductForm';
import { AlertDialog } from "../components/ui/AlertDialog";
import SlideTransition from '../components/ui/SlideTransition';
import Pagination from '../components/ui/Pagination';
import { formatRupiah, cn } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';
import DetailsPanel from '../components/ui/DetailsPanel';
import { Badge } from '../components/ui/Badge';

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Debounce search to prevent too many API calls
    const debouncedSearch = useDebounce(search, 500);

    const queryClient = useQueryClient();


    const { data: response, isLoading } = useQuery<PaginatedResponse<Product>>({
        queryKey: ['products', page, limit, debouncedSearch, sortBy, sortOrder],
        queryFn: async () => {
            const { data } = await api.get('/products', {
                params: {
                    page,
                    limit,
                    search: debouncedSearch || undefined,
                    sortBy,
                    sortOrder,
                }
            });
            if (Array.isArray(data)) return { data, meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const products = response?.data || [];
    const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
            setDeletingProduct(null);
        },
        onError: () => {
            toast.error('Failed to delete product');
        }
    });

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = (product: Product) => {
        setDeletingProduct(product);
    };

    const confirmDelete = () => {
        if (deletingProduct) {
            deleteMutation.mutate(deletingProduct.id);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Products</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your product inventory</p>
                </div>
                <Button onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="glass p-1 rounded-2xl flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-10 h-11 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0">
                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-9 pl-9 pr-8 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer appearance-none hover:text-primary transition-colors"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                            <option value="stock">Sort by Stock</option>
                            <option value="createdAt">Sort by Date</option>
                        </select>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-black/20 hover:bg-gray-50/50 dark:hover:bg-black/20 border-b border-gray-100 dark:border-white/5">
                            <TableHead className="w-[100px] text-gray-900 dark:text-gray-100 font-semibold pl-6">Image</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Name</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">SKU</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Price</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Stock</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <span className="loading loading-dots loading-md"></span>
                                        <p className="text-sm mt-2">Loading products...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <Package className="h-8 w-8 opacity-20 mb-2" />
                                        <p>No products found matching your criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 group cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <TableCell className="pl-6 py-3">
                                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                        <div className="flex flex-col">
                                            <span>{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400 font-mono text-xs">{product.sku}</TableCell>
                                    <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                        {formatRupiah(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                            product.stock <= 5
                                                ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20'
                                                : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20'
                                        )}>
                                            {product.stock} units
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                                className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                                className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="border-t border-gray-100 dark:border-white/5 p-4 bg-gray-50/30 dark:bg-black/10">
                    <Pagination
                        currentPage={page}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={(l) => { setLimit(l); setPage(1); }}
                        totalItems={meta.total}
                    />
                </div>
            </div>

            {/* Product Details Panel */}
            <DetailsPanel
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                title="Product Details"
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div className="flex flex-col items-center">
                            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-6 shadow-sm">
                                {selectedProduct.imageUrl ? (
                                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-16 w-16 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">{selectedProduct.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-4">SKU: {selectedProduct.sku}</p>

                            <div className="flex gap-2 mb-6">
                                <Badge variant={selectedProduct.stock > 0 ? "secondary" : "destructive"}>
                                    {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                                </Badge>
                                {(selectedProduct as any).category && (
                                    <Badge variant="outline">{(selectedProduct as any).category.name}</Badge>
                                )}
                            </div>
                        </div>

                        {/* Price & Stock Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</span>
                                <span className="text-xl font-bold text-primary dark:text-white">{formatRupiah(selectedProduct.price)}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.stock}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Tag className="h-4 w-4" /> Description
                            </h4>
                            <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed min-h-[100px]">
                                {selectedProduct.description || "No description provided."}
                            </div>
                        </div>

                        {/* Recent Sales (Placeholder) */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" /> Performance
                            </h4>
                            <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <span className="text-sm text-gray-500">Total Sold</span>
                                <span className="font-bold">128 units</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    handleEdit(selectedProduct);
                                    setSelectedProduct(null);
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => {
                                    handleDelete(selectedProduct);
                                    setSelectedProduct(null);
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </div>

                    </div>
                )}
            </DetailsPanel>

            {/* Product Form Dialog */}
            <Dialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={() => setIsFormOpen(false)}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={confirmDelete}
                title="Delete Product"
                description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
            />
        </SlideTransition>
    );
}

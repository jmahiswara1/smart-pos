/*
 * Products Page
 * Displays a paginated list of products with search and filtering.
     * Allows adding, editing, and deleting products.
 */
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
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog } from '../components/ui/Dialog';
import ProductForm from '../components/products/ProductForm';
import { AlertDialog } from "../components/ui/AlertDialog";
import SlideTransition from '../components/ui/SlideTransition';
import Pagination from '../components/ui/Pagination';
import { formatRupiah } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce'; // Assuming we should debounce search

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    // Debounce search to prevent too many API calls
    const [debouncedSearch] = useDebounce(search, 500);

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Products</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your product inventory</p>
                </div>
                <Button onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 font-normal"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                        <option value="stock">Sort by Stock</option>
                        <option value="createdAt">Sort by Date</option>
                    </select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="dark:border-slate-700 dark:text-gray-300"
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-slate-900/50 hover:bg-gray-50/50 dark:hover:bg-slate-900/50 border-b dark:border-slate-700">
                            <TableHead className="w-[100px] text-gray-900 dark:text-gray-100">Image</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">SKU</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Price</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Stock</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="dark:hover:bg-slate-700/50 transition-colors border-b dark:border-slate-700 last:border-0">
                                    <TableCell>
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-md object-cover bg-gray-100 dark:bg-slate-700"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                                <span className="text-xs text-gray-400">No img</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{product.name}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-300">{product.sku}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-300">
                                        {formatRupiah(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stock <= 5
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {product.stock} units
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
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
                <Pagination
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(l) => { setLimit(l); setPage(1); }}
                    totalItems={meta.total}
                />
            </div>

            {/* Product Form Dialog */}
            <Dialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <ProductForm
                    initialData={editingProduct}
                    onSuccess={() => setIsFormOpen(false)}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={confirmDelete}
                title="Are you sure?"
                description={`This action cannot be undone. This will permanently delete the product ${deletingProduct?.name}.`}
                isLoading={deleteMutation.isPending}
            />
        </SlideTransition>
    );
}

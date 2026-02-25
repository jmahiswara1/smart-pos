import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/axios';
import type { Category, PaginatedResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { AlertDialog } from '../components/ui/AlertDialog';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    Tags,
    Palette,
    Text,
    Eye
} from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
// import { cn } from '../lib/utils';
import SlideTransition from '../components/ui/SlideTransition';
import DetailsPanel from '../components/ui/DetailsPanel';
import { Badge } from '../components/ui/Badge';

// Form Schema
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const debouncedSearch = useDebounce(search, 500);

    // Fetch Categories
    const { data: response, isLoading } = useQuery<PaginatedResponse<Category>>({
        queryKey: ['categories', page, limit, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get('/categories', {
                params: { page, limit, search: debouncedSearch || undefined }
            });
            if (Array.isArray(data)) return { data, meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const categories = response?.data || [];
    const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (data: CategoryFormValues) => {
            const { data: response } = await api.post('/categories', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
            setIsCreateOpen(false);
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create category');
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CategoryFormValues }) => {
            const { data: response } = await api.patch(`/categories/${id}`, data);
            return response;
        },
        onSuccess: () => {
            // Optimistically update the cache or invalidate
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
            setEditingCategory(null);
            setIsCreateOpen(false); // Close dialog
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update category');
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
            setDeletingCategory(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        },
    });

    // Form Setup
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            color: '#000000',
            icon: '',
        }
    });

    const watchedColor = watch('color');

    // Handlers
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setValue('name', category.name);
        setValue('description', category.description || '');
        setValue('color', category.color || '#000000');
        setValue('icon', category.icon || '');
        setIsCreateOpen(true);
    };

    const onSubmit = (data: CategoryFormValues) => {
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400">Organize your products with categories</p>
                </div>
                <Button onClick={() => {
                    setEditingCategory(null);
                    reset();
                    setIsCreateOpen(true);
                }} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="glass p-1 rounded-2xl flex items-center gap-2 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search categories..."
                        className="pl-10 h-11 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
                {isLoading ? (
                    <div className="flex justify-center p-20">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-gray-500">Loading categories...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white font-semibold border-b border-gray-100 dark:border-white/5">
                                <tr className="text-left">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <Tags className="h-10 w-10 opacity-20 mb-2" />
                                                <p>No categories found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md shadow-gray-200 dark:shadow-none"
                                                        style={{ backgroundColor: category.color || '#64748b' }}
                                                    >
                                                        {category.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-base">{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-gray-500 dark:text-gray-400">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
                                                    {category._count?.products || 0} items
                                                </div>
                                            </td>
                                            <td className="flex px-6 py-4 justify-end">
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(category)} className="text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeletingCategory(category)} className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

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

            {/* Create/Edit Modal */}
            <Dialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Tags className="w-4 h-4" /> Name
                        </label>
                        <Input {...register('name')} placeholder="e.g. Electronics" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Text className="w-4 h-4" /> Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all dark:bg-slate-900 dark:border-slate-700"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Color Tag
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-14 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group cursor-pointer transition-transform active:scale-95">
                                <input
                                    type="color"
                                    {...register('color')}
                                    onChange={(e) => {
                                        setValue('color', e.target.value, { shouldValidate: true, shouldDirty: true });
                                    }}
                                    className="absolute -top-4 -left-4 w-24 h-24 p-0 cursor-pointer opacity-0"
                                    value={watchedColor || '#000000'}
                                />
                                <div
                                    className="w-full h-full"
                                    style={{ backgroundColor: watchedColor || '#000000' }}
                                />
                            </div>
                            <Input
                                {...register('color')}
                                placeholder="#000000"
                                className="flex-1 font-mono uppercase"
                                value={watchedColor || ''}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            className="shadow-lg shadow-primary/20"
                        >
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Dialog>

            <DetailsPanel
                isOpen={!!selectedCategory}
                onClose={() => setSelectedCategory(null)}
                title="Category Details"
            >
                {selectedCategory && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-4"
                                style={{ backgroundColor: selectedCategory.color || '#64748b' }}
                            >
                                {selectedCategory.name.substring(0, 2).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedCategory.name}</h2>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="bg-white/50 backdrop-blur-sm shadow-sm">
                                    {selectedCategory._count?.products || 0} Products
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Text className="h-4 w-4" /> Description
                            </h3>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm text-gray-600 dark:text-gray-300">
                                {selectedCategory.description || "No description provided."}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    handleEdit(selectedCategory);
                                    setSelectedCategory(null);
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" /> Edit Details
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => {
                                    setDeletingCategory(selectedCategory);
                                    setSelectedCategory(null);
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                )}
            </DetailsPanel>

            {/* Delete Confirmation */}
            <AlertDialog
                isOpen={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
                onConfirm={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
                title="Delete Category"
                description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
            />
        </SlideTransition>
    );
}

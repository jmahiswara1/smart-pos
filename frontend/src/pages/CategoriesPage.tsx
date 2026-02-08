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
    Loader2
} from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';

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
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearch] = useDebounce(search, 500);

    // Fetch Categories
    const { data: response, isLoading } = useQuery<PaginatedResponse<Category>>({
        queryKey: ['categories', page, limit, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get('/categories', {
                params: { page, limit, search: debouncedSearch || undefined }
            });
            console.log('Categories API Response:', data);
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
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
            setEditingCategory(null);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Button onClick={() => {
                    setEditingCategory(null);
                    reset();
                    setIsCreateOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-white p-4 rounded-lg border shadow-sm">
                <Search className="text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="flex-1 outline-none text-sm"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr className="text-left">
                                    <th className="px-6 py-3 font-semibold">Name</th>
                                    <th className="px-6 py-3 font-semibold">Description</th>
                                    <th className="px-6 py-3 font-semibold">Products</th>
                                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-600">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 group transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                                                        style={{ backgroundColor: category.color || '#64748b' }}
                                                    >
                                                        {category.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {category._count?.products || 0} items
                                            </td>
                                            <td className="flex px-6 py-4 justify-end">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeletingCategory(category)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
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

                <Pagination
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(l) => { setLimit(l); setPage(1); }}
                    totalItems={meta.total}
                />
            </div>

            {/* Create/Edit Modal */}
            <Dialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input {...register('name')} placeholder="e.g. Electronics" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color (Hex)</label>
                            <div className="flex items-center gap-2">
                                <span className="h-9 w-9 rounded overflow-hidden border border-gray-300 relative">
                                    <input
                                        type="color"
                                        {...register('color')}
                                        onChange={(e) => {
                                            setValue('color', e.target.value, { shouldValidate: true, shouldDirty: true });
                                        }}
                                        className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer opacity-0"
                                        value={watchedColor || '#000000'}
                                    />
                                    <div
                                        className="w-full h-full"
                                        style={{ backgroundColor: watchedColor || '#000000' }}
                                    />
                                </span>
                                <Input
                                    {...register('color')}
                                    placeholder="#000000"
                                    className="flex-1"
                                    value={watchedColor || ''}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                isOpen={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
                onConfirm={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
                title="Delete Category"
                description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

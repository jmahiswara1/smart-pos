import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { Product, Category } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { TabsTrigger } from '../ui/Tabs';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    price: z.coerce.number().min(0),
    cost: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0),
    minStock: z.coerce.number().min(0).optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true),
    imageUrl: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'media'>('general');
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            isActive: true,
            stock: 0,
            minStock: 5,
            price: 0,
            cost: 0,
        }
    });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                categoryId: initialData.categoryId,
                description: initialData.description || '',
                sku: initialData.sku,
                price: initialData.price,
                cost: initialData.cost || 0,
                stock: initialData.stock,
                minStock: initialData.minStock,
                barcode: initialData.barcode || '',
                isActive: initialData.isActive,
                imageUrl: initialData.imageUrl || '',
            });
        }
    }, [initialData, reset]);

    const imageUrl = watch('imageUrl');

    // Fetch Categories
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories');
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: ProductFormValues) => {
            const { data: response } = await api.post('/products', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: ProductFormValues) => {
            if (!initialData) return;
            const { data: response } = await api.patch(`/products/${initialData.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setValue('imageUrl', data.url); // Adjust based on actual response structure
            toast.success('Image uploaded');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data: ProductFormValues) => {
        if (initialData) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                <TabsTrigger
                    onClick={() => setActiveTab('general')}
                    active={activeTab === 'general'}
                    className="flex-1"
                >
                    General
                </TabsTrigger>
                <TabsTrigger
                    onClick={() => setActiveTab('pricing')}
                    active={activeTab === 'pricing'}
                    className="flex-1"
                >
                    Pricing & Stock
                </TabsTrigger>
                <TabsTrigger
                    onClick={() => setActiveTab('media')}
                    active={activeTab === 'media'}
                    className="flex-1"
                >
                    Media
                </TabsTrigger>
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'general' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input {...register('name')} placeholder="e.g. Wireless Mouse" />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="text-sm font-medium">SKU</label>
                                <Input {...register('sku')} placeholder="SKU-123456" />
                                {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    {...register('categoryId')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea {...register('description')} placeholder="Product description..." rows={4} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Selling Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                                    <Input {...register('price')} type="number" className="pl-9" />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Cost Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                                    <Input {...register('cost')} type="number" className="pl-9" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Current Stock</label>
                                <Input {...register('stock')} type="number" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Min Stock Alert</label>
                                <Input {...register('minStock')} type="number" />
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm font-medium">Barcode (Optional)</label>
                                <Input {...register('barcode')} placeholder="Scanned barcode..." />
                            </div>

                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    id="isActive"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">Active (Visible in POS)</label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                            {imageUrl ? (
                                <div className="relative w-full aspect-video max-h-[200px]">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => setValue('imageUrl', '')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        {uploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <ImageIcon className="h-6 w-6 text-gray-400" />}
                                    </div>
                                    <div>
                                        <label htmlFor="file-upload" className="cursor-pointer font-medium text-primary hover:text-primary/80">
                                            Upload a file
                                        </label>
                                        <span className="text-gray-500"> or drag and drop</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Or enter image URL</label>
                            <Input {...register('imageUrl')} placeholder="https://..." className="mt-1" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                    {initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}

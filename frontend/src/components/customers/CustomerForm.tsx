import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { Customer } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import toast from 'react-hot-toast';

const customerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
    initialData?: Customer | null;
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function CustomerForm({ initialData, onSuccess, onCancel }: CustomerFormProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema) as any,
        defaultValues: {
            email: '',
            phone: '',
            address: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
            });
        }
    }, [initialData, reset]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: CustomerFormValues) => {
            const { data: response } = await api.post('/customers', data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer created successfully');
            onSuccess(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create customer');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: CustomerFormValues) => {
            if (!initialData) return;
            const { data: response } = await api.patch(`/customers/${initialData.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer updated successfully');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update customer');
        }
    });

    const onSubmit = (data: CustomerFormValues) => {
        // Clean up empty strings for optional fields
        const formattedData = {
            ...data,
            email: data.email === '' ? undefined : data.email,
            isActive: true, // Always set new customers as active
        };

        if (initialData) {
            updateMutation.mutate(formattedData);
        } else {
            createMutation.mutate(formattedData);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input {...register('name')} placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                    <Input {...register('email')} type="email" placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                    <Input {...register('phone')} placeholder="+62..." />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                <Textarea {...register('address')} placeholder="Customer address..." rows={3} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
                >
                    {initialData ? 'Update Customer' : 'Add Customer'}
                </Button>
            </div>
        </form>
    );
}

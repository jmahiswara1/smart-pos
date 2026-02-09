import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Customer, PaginatedResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '../components/ui/Table';
import { Dialog } from '../components/ui/Dialog';
import CustomerForm from '../components/customers/CustomerForm';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Pencil,
    Mail,
    Phone,
    UserCheck,
    UserX
} from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import SlideTransition from '../components/ui/SlideTransition';
import Pagination from '../components/ui/Pagination';
import { formatRupiah } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

    const [debouncedSearch] = useDebounce(search, 500);

    // Fetch Customers
    const { data: response, isLoading } = useQuery<PaginatedResponse<Customer>>({
        queryKey: ['customers', page, limit, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get('/customers', {
                params: { page, limit, search: debouncedSearch || undefined }
            });
            console.log('Customers API Response:', data);
            // Check if data is array or object with data property
            if (Array.isArray(data)) return { data, meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const customers = response?.data || [];
    const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

    // Toggle Active Mutation
    const toggleMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/customers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update customer status');
        },
    });

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsCreateOpen(true);
    };

    const handleClose = () => {
        setIsCreateOpen(false);
        setEditingCustomer(undefined);
    };

    const handleToggleActive = (customer: Customer) => {
        toggleMutation.mutate(customer.id);
    };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Customers</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your customer base and view their history</p>
                </div>
                <Button onClick={() => { setEditingCustomer(undefined); setIsCreateOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
                <Search className="text-gray-400 h-5 w-5" />
                <Input
                    placeholder="Search items by name, email, or phone..."
                    className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent dark:text-gray-100 placeholder:text-gray-400"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 font-medium border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-900/50">
                            <TableHead className="w-[200px] text-gray-900 dark:text-gray-100">Customer</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Contact Info</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Total Spent</TableHead>
                            <TableHead className="text-center text-gray-900 dark:text-gray-100">Status</TableHead>
                            <TableHead className="text-right text-gray-900 dark:text-gray-100">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 group transition-colors border-b dark:border-slate-700 last:border-0">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col gap-1">
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Mail className="h-3 w-3" /> {customer.email}
                                                </div>
                                            )}
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Phone className="h-3 w-3" /> {customer.phone}
                                                </div>
                                            )}
                                            {!customer.email && !customer.phone && <span className="text-gray-400 dark:text-gray-600 text-xs">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatRupiah(customer.totalPurchases)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={customer.isActive ? "success" : "danger"}>
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex px-6 py-4 justify-end">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleActive(customer)}
                                                className={customer.isActive
                                                    ? "text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                    : "text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                }
                                                title={customer.isActive ? "Deactivate customer" : "Activate customer"}
                                            >
                                                {customer.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Pagination
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(l) => { setLimit(l); setPage(1); }}
                    totalItems={meta.total}
                />
            </div>

            <Dialog
                isOpen={isCreateOpen}
                onClose={handleClose}
                title={editingCustomer ? 'Edit Customer' : 'New Customer'}
            >
                <CustomerForm
                    initialData={editingCustomer}
                    onSuccess={handleClose}
                    onCancel={handleClose}
                />
            </Dialog>


        </SlideTransition>
    );
}

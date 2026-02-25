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
import { AlertDialog } from '../components/ui/AlertDialog';
import CustomerForm from '../components/customers/CustomerForm';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Pencil,
    Mail,
    Phone,
    UserCheck,
    UserX,
    Users,
    MapPin,
    ShoppingBag,
    Calendar,
    Eye
} from 'lucide-react';
// import { Skeleton } from '../components/ui/Skeleton';
import SlideTransition from '../components/ui/SlideTransition';
import Pagination from '../components/ui/Pagination';
import { formatRupiah, cn } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';
import DetailsPanel from '../components/ui/DetailsPanel';

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
    const [toggleStatusCustomer, setToggleStatusCustomer] = useState<Customer | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    // Fetch Customers
    const { data: response, isLoading } = useQuery<PaginatedResponse<Customer>>({
        queryKey: ['customers', page, limit, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get('/customers', {
                params: { page, limit, search: debouncedSearch || undefined }
            });
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
            const customer = customers.find(c => c.id === id);
            if (!customer) throw new Error("Customer not found");

            await api.patch(`/customers/${id}`, { isActive: !customer.isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer status updated successfully');
            setToggleStatusCustomer(null);
            // Also update selected customer if valid
            if (selectedCustomer) {
                const updated = customers.find(c => c.id === selectedCustomer.id);
                if (updated) setSelectedCustomer({ ...updated, isActive: !updated.isActive });
            }
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

    const confirmToggleStatus = () => {
        if (toggleStatusCustomer) {
            toggleMutation.mutate(toggleStatusCustomer.id);
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Customers</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your customer base and view their history</p>
                </div>
                <Button onClick={() => { setEditingCustomer(undefined); setIsCreateOpen(true); }} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </div>

            <div className="glass p-1 rounded-2xl flex items-center gap-2 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search items by name, email, or phone..."
                        className="pl-10 h-11 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white font-semibold border-b border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-black/20">
                            <TableHead className="w-[300px] pl-6 py-4">Customer</TableHead>
                            <TableHead className="py-4">Contact Info</TableHead>
                            <TableHead className="py-4">Total Spent</TableHead>
                            <TableHead className="text-center py-4">Status</TableHead>
                            <TableHead className="text-right pr-6 py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <span className="loading loading-dots loading-md"></span>
                                        <p className="text-sm mt-2">Loading customers...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <Users className="h-8 w-8 opacity-20 mb-2" />
                                        <p>No customers found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 group cursor-pointer"
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Mail className="h-3.5 w-3.5 opacity-70" /> {customer.email}
                                                </div>
                                            )}
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Phone className="h-3.5 w-3.5 opacity-70" /> {customer.phone}
                                                </div>
                                            )}
                                            {!customer.email && !customer.phone && <span className="text-gray-400 dark:text-gray-600 text-xs">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                                        {formatRupiah(customer.totalPurchases)}
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <Badge
                                            className={cn("px-2.5 py-0.5 rounded-full font-medium border shadow-sm",
                                                customer.isActive
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                                            )}
                                        >
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                                                className="text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(customer); }}
                                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); setToggleStatusCustomer(customer); }}
                                                className={customer.isActive
                                                    ? "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    : "text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
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

            {/* Customer Details Panel */}
            <DetailsPanel
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                title="Customer Details"
            >
                {selectedCustomer && (
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-white dark:bg-black/30 border-4 border-white dark:border-white/5 flex items-center justify-center text-3xl font-bold text-primary shadow-lg mb-4">
                                {selectedCustomer.name.substring(0, 2).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedCustomer.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Member since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>

                            <Badge
                                className={cn("px-3 py-1 rounded-full font-medium text-xs",
                                    selectedCustomer.isActive
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                )}
                            >
                                {selectedCustomer.isActive ? 'Active Customer' : 'Inactive Account'}
                            </Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="h-4 w-4" /> Personal Information
                            </h4>
                            <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedCustomer.email || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCustomer.phone || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCustomer.address || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase">Total Purchases</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatRupiah(selectedCustomer.totalPurchases)}</p>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase">Last Visit</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedCustomer.lastVisit ? new Date(selectedCustomer.lastVisit).toLocaleDateString() : 'Never'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    handleEdit(selectedCustomer);
                                    setSelectedCustomer(null);
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" /> Edit Details
                            </Button>
                        </div>
                    </div>
                )}
            </DetailsPanel>

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

            <AlertDialog
                isOpen={!!toggleStatusCustomer}
                onClose={() => setToggleStatusCustomer(null)}
                onConfirm={confirmToggleStatus}
                title={toggleStatusCustomer?.isActive ? "Deactivate Customer" : "Activate Customer"}
                description={`Are you sure you want to ${toggleStatusCustomer?.isActive ? 'deactivate' : 'activate'} this customer?`}
                isLoading={toggleMutation.isPending}
            />

        </SlideTransition>
    );
}

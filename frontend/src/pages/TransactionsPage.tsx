import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Transaction } from '../types';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, Calendar, User, Banknote, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '../components/ui/Skeleton';
import SlideTransition from '../components/ui/SlideTransition';
import { useDebounce } from '../hooks/useDebounce';
import { keepPreviousData } from '@tanstack/react-query';
import Pagination from '../components/ui/Pagination';
import { formatRupiah } from '../lib/utils';
import type { PaginatedResponse } from '../types';

/*
 * Transactions Page
 * Displays a historical list of all transactions with filtering and pagination.
 */
export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearch] = useDebounce(search, 500);

    // Fetch Transactions
    const { data: response, isLoading } = useQuery<PaginatedResponse<Transaction>>({
        queryKey: ['transactions', page, limit, debouncedSearch],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<Transaction>>('/transactions', {
                params: { page, limit, search: debouncedSearch || undefined }
            });
            if (Array.isArray(data)) return { data, meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const transactions = response?.data || [];
    const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and manage sales history</p>
                </div>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
                <Search className="text-gray-400 h-5 w-5" />
                <Input
                    placeholder="Search by transaction ID or customer name..."
                    className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent dark:text-gray-100 placeholder:text-gray-400"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 font-medium border-b dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Payment</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx: Transaction) => (
                                    <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 group transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-gray-100">
                                            {trx.transactionNumber}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(trx.createdAt), 'dd MMM yyyy HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {trx.customer ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-gray-400" />
                                                    {trx.customer.name}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic">Walk-in Customer</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">
                                            <div className="flex items-center gap-2">
                                                {trx.paymentMethod === 'cash' ? <Banknote className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                                                {trx.paymentMethod.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                                            {formatRupiah(trx.total)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 border-green-200 dark:border-green-900/30">
                                                Paid
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(l: number) => { setLimit(l); setPage(1); }}
                    totalItems={meta.total}
                />
            </div>
        </SlideTransition>
    );
}

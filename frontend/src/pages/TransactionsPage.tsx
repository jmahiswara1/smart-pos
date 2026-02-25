import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Transaction } from '../types';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, Calendar, User, Banknote, CreditCard, Receipt, Eye, Printer, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import SlideTransition from '../components/ui/SlideTransition';
import { useDebounce } from '../hooks/useDebounce';
import { keepPreviousData } from '@tanstack/react-query';
import Pagination from '../components/ui/Pagination';
import { formatRupiah } from '../lib/utils';
import type { PaginatedResponse } from '../types';
import DetailsPanel from '../components/ui/DetailsPanel';

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const debouncedSearch = useDebounce(search, 500);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <SlideTransition className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and manage sales history</p>
                </div>
            </div>

            <div className="glass p-1 rounded-2xl flex items-center gap-2 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by transaction ID or customer name..."
                        className="pl-10 h-11 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-100 dark:border-white/5">
                            <tr className="text-left">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {isLoading ? (
                                <tr className="bg-transparent">
                                    <td colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <span className="loading loading-dots loading-md"></span>
                                            <p className="text-sm mt-2">Loading transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="h-32 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Receipt className="h-8 w-8 opacity-20 mb-2" />
                                            <p>No transactions found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx: Transaction) => (
                                    <tr
                                        key={trx.id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedTransaction(trx)}
                                    >
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-gray-100 text-xs">
                                            {trx.transactionNumber}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                {format(new Date(trx.createdAt), 'dd MMM yyyy, HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {trx.customer ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5 text-gray-400" />
                                                    {trx.customer.name}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">Walk-in Customer</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">
                                            <div className="flex items-center gap-2">
                                                {trx.paymentMethod === 'cash' ? <Banknote className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
                                                {trx.paymentMethod.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                                            {formatRupiah(trx.total)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 px-2.5 py-0.5 shadow-sm">
                                                Paid
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 text-gray-500 hover:text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTransaction(trx);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-100 dark:border-white/5 p-4 bg-gray-50/30 dark:bg-black/10">
                    <Pagination
                        currentPage={page}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={(l: number) => { setLimit(l); setPage(1); }}
                        totalItems={meta.total}
                    />
                </div>
            </div>

            {/* Transaction Details Panel */}
            <DetailsPanel
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                title="Transaction Details"
            >
                {selectedTransaction && (
                    <div className="space-y-6">
                        {/* Transaction Header */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 shadow-lg shadow-primary/20">
                                {selectedTransaction.customer?.name?.[0].toUpperCase() || "W"}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedTransaction.customer?.name || "Walk-in Customer"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(selectedTransaction.createdAt), 'dd MMMM yyyy • HH:mm')}
                            </p>
                            <Badge className="mt-3 bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                            </Badge>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Order Items</h4>
                            <div className="space-y-3">
                                {selectedTransaction.items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        <div className="flex gap-3">
                                            <div className="bg-gray-100 dark:bg-white/10 h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {item.product?.name || "Product Name"}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatRupiah(item.price)} per unit
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {formatRupiah(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 space-y-3 border border-gray-100 dark:border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatRupiah(selectedTransaction.total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatRupiah(0)}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 dark:border-white/10 my-2 pt-2 flex justify-between items-end">
                                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                                <span className="text-xl font-bold text-primary dark:text-white">{formatRupiah(selectedTransaction.total)}</span>

                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Payment Information</h4>
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        {selectedTransaction.paymentMethod === 'cash' ? <Banknote className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-white capitalize">
                                            {selectedTransaction.paymentMethod.replace('_', ' ')}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            #TRX-{selectedTransaction.transactionNumber}
                                        </p>
                                    </div>
                                </div>
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Verified</Badge>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <Button variant="outline" className="w-full gap-2">
                                <Printer className="h-4 w-4" /> Print Receipt
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                                <Mail className="h-4 w-4" /> Email Receipt
                            </Button>
                        </div>
                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                            Refund Transaction
                        </Button>

                    </div>
                )}
            </DetailsPanel>
        </SlideTransition>
    );
}

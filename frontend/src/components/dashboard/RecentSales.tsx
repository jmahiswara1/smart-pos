import { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { Transaction } from '../../types';
import { ShoppingBag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '../ui/Skeleton';
import { gsap } from 'gsap';
import { formatRupiah } from '../../lib/utils';

export default function RecentSales() {
    const listRef = useRef<HTMLDivElement>(null);

    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['recent-transactions'],
        queryFn: async () => {
            const { data } = await api.get('/transactions');
            let allTransactions = [];
            if (Array.isArray(data)) allTransactions = data;
            else if (data && Array.isArray(data.data)) allTransactions = data.data;

            // Sort by date desc (latest first) and take top 5
            return allTransactions.sort((a: Transaction, b: Transaction) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 5);
        },
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (!isLoading && transactions && listRef.current) {
            const items = listRef.current.children;
            gsap.fromTo(items,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [isLoading, transactions]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                            <Skeleton className="h-3 w-12 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6" ref={listRef}>
            {transactions?.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4 dark:text-gray-400">No recent sales</p>
            ) : (
                transactions?.map((trx) => (
                    <div key={trx.id} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                                <ShoppingBag className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {trx.customer ? trx.customer.name : 'Walk-in Customer'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {trx.customer?.email || trx.transactionNumber}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {formatRupiah(trx.total)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(trx.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

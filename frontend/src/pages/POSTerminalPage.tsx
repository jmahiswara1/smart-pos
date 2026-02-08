import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useCart } from '../features/pos/hooks/useCart';
import CartSidebar from '../features/pos/components/CartSidebar';
import ProductGrid from '../features/pos/components/ProductGrid';
import CheckoutModal from '../features/pos/components/CheckoutModal';
import toast from 'react-hot-toast';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import SlideTransition from '../components/ui/SlideTransition';
import { formatRupiah } from '../lib/utils';

export default function POSTerminalPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const { items, customer, subtotal, clearCart } = useCart();
    const queryClient = useQueryClient();

    // Create Transaction Mutation
    const transactionMutation = useMutation({
        mutationFn: async ({ paymentMethod, cashGiven }: { paymentMethod: string, cashGiven: number }) => {
            const transactionData = {
                customerId: customer?.id || null,
                paymentMethod,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                tax: 0,
                discount: 0,
                notes: cashGiven ? `Cash Given: ${cashGiven}` : ''
            };

            const { data } = await api.post('/transactions', transactionData);
            return data;
        },
        onSuccess: (data) => {
            toast.success(`Transaction ${data.transactionNumber} completed!`);
            clearCart();
            setIsCheckoutOpen(false);
            setIsMobileCartOpen(false);
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
            queryClient.invalidateQueries({ queryKey: ['pos-products'] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    });

    const handleCheckout = (paymentMethod: string, cashGiven?: number) => {
        if (items.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        // Trigger the transaction mutation
        transactionMutation.mutate({
            paymentMethod,
            cashGiven: cashGiven || 0
        });
    };



    return (
        <SlideTransition className="flex h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)] overflow-hidden relative">
            {/* Product Area */}
            <div className="flex-1 overflow-hidden relative border-r bg-gray-50/50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 flex flex-col transition-colors">
                <div className="flex-1 overflow-hidden relative">
                    <ProductGrid />
                </div>

                {/* Mobile Cart Floating Button */}
                <div className="md:hidden p-4 bg-white dark:bg-slate-950 border-t dark:border-slate-800 safe-area-bottom">
                    <Button
                        onClick={() => setIsMobileCartOpen(true)}
                        className="w-full h-12 rounded-full shadow-lg flex items-center justify-between px-6 text-base"
                        size="lg"
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="font-bold">{items.reduce((a, b) => a + b.quantity, 0)} items</span>
                        </div>
                        <span className="font-bold">{formatRupiah(subtotal())}</span>
                    </Button>
                </div>
            </div>

            {/* Desktop Sidebar Area */}
            <div className="hidden md:block w-[400px] flex-shrink-0 bg-white dark:bg-slate-950 shadow-xl z-20 border-l dark:border-slate-800 h-full transition-colors">
                <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
            </div>

            {/* Mobile Cart Sheet/Overlay */}
            {isMobileCartOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white dark:bg-slate-950 animate-in slide-in-from-bottom duration-300">
                    <div className="h-14 border-b dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-950 sticky top-0 z-10 transition-colors">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Your Cart</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileCartOpen(false)}>
                            <X className="h-6 w-6 dark:text-gray-100" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    onConfirm={(method, cash) => handleCheckout(method, cash)}
                    isLoading={transactionMutation.isPending}
                    total={subtotal()}
                />
            )}
        </SlideTransition>
    );
}

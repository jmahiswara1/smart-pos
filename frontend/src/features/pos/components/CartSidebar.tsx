import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '../../../components/ui/Button';
import CustomerSelector from './CustomerSelector';
import { useEffect, useRef } from 'react';
import { formatRupiah } from '../../../lib/utils';

interface CartSidebarProps {
    onCheckout: () => void;
}

export default function CartSidebar({ onCheckout }: CartSidebarProps) {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when items change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [items.length]);

    const total = subtotal();

    return (
        <div className="flex flex-col h-full bg-white border-l shadow-xl w-96">
            {/* Header */}
            <div className="p-4 border-b bg-white z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" /> Current Order
                    </h2>
                    <Button variant="ghost" size="sm" onClick={clearCart} disabled={items.length === 0} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Clear
                    </Button>
                </div>

                {/* Customer Selector */}
                <CustomerSelector />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                        <ShoppingCart className="h-12 w-12 opacity-20" />
                        <p>Cart is empty</p>
                        <p className="text-xs">Select products to start an order</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg group animate-in slide-in-from-right-2 duration-200">
                            <div className="h-16 w-16 bg-white rounded-md border overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                                        <span className="text-xs">IMG</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{formatRupiah(item.price)}</p>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3 bg-white rounded-md border px-2 py-1 shadow-sm">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-0.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-0.5 hover:bg-gray-100 rounded text-gray-600"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {formatRupiah(item.price * item.quantity)}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors self-start"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Totals */}
            <div className="p-4 bg-white border-t space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatRupiah(subtotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (0%)</span>
                        <span>{formatRupiah(0)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                        <span>Total</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="w-full text-lg py-6 shadow-lg shadow-primary/20"
                    disabled={items.length === 0}
                    onClick={onCheckout}
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
}

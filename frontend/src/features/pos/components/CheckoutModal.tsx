import { useState } from 'react';
import { formatRupiah } from '../../../lib/utils';
import { Dialog } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

import { Banknote, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: string, cashGiven?: number) => void;
    isLoading: boolean;
    total: number;
}

export default function CheckoutModal({ isOpen, onClose, onConfirm, isLoading, total }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashGiven, setCashGiven] = useState('');

    const change = paymentMethod === 'cash' && cashGiven ? Number(cashGiven) - total : 0;
    const canConfirm = paymentMethod !== 'cash' || (Number(cashGiven) >= total);



    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Process Payment">
            <div className="space-y-6">
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">{formatRupiah(total)}</p>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'cash'
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Banknote className="h-4 w-4" />
                            Cash
                        </button>
                        <button
                            onClick={() => setPaymentMethod('debit_card')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'debit_card'
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <CreditCard className="h-4 w-4" />
                            Card / Qris
                        </button>
                    </div>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium">Cash Given</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                            <Input
                                type="number"
                                value={cashGiven}
                                onChange={(e) => setCashGiven(e.target.value)}
                                className="pl-9 text-lg font-medium"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2 text-sm">
                            <span className="text-gray-600">Change</span>
                            <span className={`font-bold text-lg ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {formatRupiah(Math.max(0, change))}
                            </span>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="flex gap-2">
                            {[total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000].filter((v, i, a) => a.indexOf(v) === i && v >= total).slice(0, 3).map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setCashGiven(amount.toString())}
                                    className="px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    {formatRupiah(amount)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        className="flex-[2]"
                        disabled={!canConfirm || isLoading}
                        onClick={() => onConfirm(paymentMethod, Number(cashGiven))}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Processing...' : `Confirm Payment`}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

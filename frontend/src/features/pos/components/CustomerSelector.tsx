import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import type { Customer } from '../../../types';
import { Search, User, X, Check } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { useCart } from '../hooks/useCart';
import CustomerForm from '../../../components/customers/CustomerForm';
import { Dialog } from '../../../components/ui/Dialog';

export default function CustomerSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { customer, setCustomer } = useCart();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // State for Add Customer Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newestCustomerId, setNewestCustomerId] = useState<string | null>(null);

    // Fetch Customers
    const { data: customers, isLoading, refetch } = useQuery<Customer[]>({
        queryKey: ['pos-customers'],
        queryFn: async () => {
            const { data } = await api.get('/customers');
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        },
        enabled: isOpen // Only fetch when dropdown is open
    });

    const filteredCustomers = customers?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
    );

    const handleSelect = (c: Customer) => {
        setCustomer(c);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomer(null);
    };

    const handleCustomerCreated = (newCustomer: Customer) => {
        setNewestCustomerId(newCustomer.id);
        setCustomer(newCustomer);
        setIsAddModalOpen(false);
        setIsOpen(false); // Close dropdown as we selected the user
        refetch(); // Ensure list is up to date next time
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border border-dashed transition-all text-sm group ${customer
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                    }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${customer ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <User className="h-4 w-4" />
                    </div>
                    <div className="text-left truncate">
                        <p className={`font-medium truncate ${customer ? 'text-gray-900' : 'text-gray-500'}`}>
                            {customer ? customer.name : 'Select Customer'}
                        </p>
                        {customer && <p className="text-xs text-gray-500 truncate">{customer.phone || customer.email || 'No contact info'}</p>}
                    </div>
                </div>
                {customer && (
                    <div
                        role="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                    >
                        <X className="h-4 w-4" />
                    </div>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b space-y-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                            <Input
                                placeholder="Search customer..."
                                className="pl-8 h-8 text-xs bg-gray-50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        {/* Add Customer Button */}
                        <button
                            onClick={() => {
                                setIsAddModalOpen(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-xs font-medium transition-colors"
                        >
                            + Add New Customer
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-xs text-gray-400">Loading customers...</div>
                        ) : filteredCustomers?.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-400">No customers found</div>
                        ) : (
                            filteredCustomers?.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => handleSelect(c)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between hover:bg-gray-50 ${customer?.id === c.id ? 'bg-gray-50 text-primary font-medium' : 'text-gray-700'}`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p>{c.name}</p>
                                            {c.id === newestCustomerId && (
                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">New!</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400">{c.phone}</p>
                                    </div>
                                    {customer?.id === c.id && <Check className="h-3.5 w-3.5" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            <Dialog
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Customer"
            >
                <CustomerForm
                    onSuccess={handleCustomerCreated}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Dialog>
        </div>
    );
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
}

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    description: string | null;
    sku: string;
    price: number;
    cost: number | null;
    stock: number;
    minStock: number;
    imageUrl: string | null;
    barcode: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    category?: Category;
}

export interface Customer {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    totalPurchases: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    transactionNumber: string;
    customerId: string | null;
    userId: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    customer?: Customer;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    limit: number;
    onLimitChange: (limit: number) => void;
    totalItems: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    limit,
    onLimitChange,
    totalItems
}: PaginationProps) {
    return (
        <div className="flex items-center justify-between px-2 py-4 border-t">
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * limit + 1, totalItems)}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </div>

                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="h-8 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value={10}>10 rows</option>
                    <option value={50}>50 rows</option>
                    <option value={1000}>All</option>
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

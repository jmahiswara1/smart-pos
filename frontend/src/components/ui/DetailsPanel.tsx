import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';

interface DetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function DetailsPanel({ isOpen, onClose, title, children, className }: DetailsPanelProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            // Small delay to allow render before animation
            setTimeout(() => setIsVisible(true), 10);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setIsRendered(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "relative w-full max-w-md h-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-l border-white/50 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
                    isVisible ? "translate-x-0" : "translate-x-full",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

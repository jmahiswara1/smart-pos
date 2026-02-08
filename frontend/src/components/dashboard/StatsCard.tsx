import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { cn, formatRupiah } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';

interface StatsCardProps {
    title: string;
    value: number; // Raw number for animation
    formattedValue?: string; // Optional pre-formatted string (if animating raw number is tricky with currency formatters)
    icon: React.ElementType;
    description?: string;
    className?: string;
    isLoading?: boolean;
}

export default function StatsCard({
    title,
    value,
    formattedValue,
    icon: Icon,
    description,
    className,
    isLoading,
}: StatsCardProps) {
    const countRef = useRef<HTMLSpanElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading && countRef.current) {
            if (formattedValue) {
                // If pre-formatted, we can't easily animate the number itself without parsing.
                // For simplicity, let's just fade it in or animate the scale.
                gsap.fromTo(countRef.current,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            } else {
                // Animate raw number
                gsap.fromTo(countRef.current,
                    { innerText: 0 },
                    {
                        innerText: value,
                        duration: 1.5,
                        ease: "power2.out",
                        snap: { innerText: 1 }, // Snap to integer
                        onUpdate: function () {
                            if (countRef.current) {
                                countRef.current.innerText = Math.ceil(Number(this.targets()[0].innerText)).toString();
                            }
                        }
                    }
                );
            }
        }
    }, [value, isLoading, formattedValue]);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className={cn(
                "bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700 transition-colors cursor-default",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    {isLoading ? (
                        <Skeleton className="h-8 w-32 mt-2" />
                    ) : (
                        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                            {formattedValue ? (
                                <span ref={countRef}>{formattedValue}</span>
                            ) : (
                                <span ref={countRef}>{formatRupiah(0)}</span>
                            )}
                        </h3>
                    )}
                    {description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
            </div>
        </motion.div>
    );
}

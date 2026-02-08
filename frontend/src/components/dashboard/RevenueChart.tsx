import { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { formatRupiah } from '../../lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Skeleton } from '../ui/Skeleton';
import { useThemeStore } from '../../lib/theme-store';
import { gsap } from 'gsap';

interface DailySales {
    date: string;
    totalSales: number;
    count: number;
}

export default function RevenueChart() {
    const { theme } = useThemeStore();
    const chartRef = useRef<HTMLDivElement>(null);

    const { data: dailySales, isLoading } = useQuery<DailySales[]>({
        queryKey: ['daily-sales'],
        queryFn: async () => {
            const { data } = await api.get('/transactions/daily-sales');
            return data;
        },
    });

    // GSAP Entrance Animation
    useEffect(() => {
        if (!isLoading && chartRef.current) {
            gsap.fromTo(chartRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
            );
        }
    }, [isLoading]);

    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-lg" />;
    }

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
        }
        return value.toString();
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 border dark:border-slate-700 rounded-lg shadow-lg">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{label}</p>
                    <p className="text-primary font-bold">
                        {formatRupiah(payload[0].value)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payload[0].payload.count} Transactions
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[300px] w-full" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dailySales}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#E5E7EB'} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#6B7280' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#6B7280' }}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f3f4f6' }} content={<CustomTooltip />} />
                    <Bar
                        dataKey="totalSales"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        // Optional: Animation inside Recharts is automatic, but we can customize if needed.
                        // isAnimationActive={true} 
                        animationDuration={1500}
                        animationEasing="ease-out"
                    >
                        {dailySales?.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={theme === 'dark' ? '#3b82f6' : '#0f172a'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

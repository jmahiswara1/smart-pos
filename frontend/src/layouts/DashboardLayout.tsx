import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Tags,
    Users,
    History,
    LogOut,
    Menu as MenuIcon,
    UserCircle,
    Calendar
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../lib/auth-store';
import { format } from 'date-fns';

const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/pos', label: 'POS Terminal', icon: ShoppingCart },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/categories', label: 'Categories', icon: Tags },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/transactions', label: 'Transactions', icon: History },
];

export default function DashboardLayout() {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={cn("flex h-screen bg-gray-50 text-gray-900 transition-colors")}>
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b dark:border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <img src="/logo.png" alt="SmartPOS" className="h-8 w-8 rounded-lg object-contain" />
                        SmartPOS
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-2">Checkouts</p>
                    {navItems.slice(0, 2).map((item) => { // Dashboard & POS
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}

                    <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</p>
                    {navItems.slice(2).map((item) => { // Products, Categories, etc.
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t dark:border-slate-800 space-y-2">
                    <Link
                        to="/profile"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <UserCircle className="w-5 h-5" />
                        Profile
                    </Link>
                </div>
            </aside>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white flex items-center justify-between px-4 md:px-8 z-40 sticky top-0 transition-all">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col animate-in slide-in-from-left-2">
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                Welcome, {user?.fullName?.split(' ')[0] || 'User'}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                                Here's what happening in your store today.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Calendar Widget */}
                        <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-slate-800 rounded-full pl-1 pr-2 py-1">
                            <div className="h-9 w-9 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 shadow-sm text-sm">
                                {format(new Date(), 'd')}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{format(new Date(), 'EEE,')}</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{format(new Date(), 'MMMM')}</span>
                            </div>
                            <button className="p-2 ml-1 rounded-full bg-white dark:bg-slate-950 text-gray-500 hover:text-primary transition-colors relative shadow-sm">
                                <Calendar className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative ml-2">
                            <Menu.Button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-950 transition-all">
                                <div className="h-10 w-10 bg-primary/10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-primary font-bold">
                                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserCircle className="h-6 w-6" />}
                                </div>
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-slate-800 border dark:border-slate-800 z-50">
                                    <div className="px-4 py-3">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={cn(
                                                        "group flex w-full items-center px-4 py-2 text-sm",
                                                        active ? "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                    )}
                                                >
                                                    <UserCircle className="mr-2 h-4 w-4 text-gray-400 group-hover:text-primary" />
                                                    Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={logout}
                                                    className={cn(
                                                        "group flex w-full items-center px-4 py-2 text-sm text-red-600",
                                                        active ? "bg-red-50 dark:bg-red-900/10" : ""
                                                    )}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4 group-hover:text-red-600" />
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-slate-900 relative">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

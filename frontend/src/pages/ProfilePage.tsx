import { useAuthStore } from '../lib/auth-store';
import { Button } from '../components/ui/Button';
import { LogOut, Mail, Shield, User } from 'lucide-react';
import SlideTransition from '../components/ui/SlideTransition';

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    return (
        <SlideTransition className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account settings</p>
            </div>

            <div className="glass overflow-hidden rounded-3xl shadow-sm border border-white/50 dark:border-white/5 relative">
                {/* Header Background */}
                <div className="h-40 bg-gradient-to-r from-primary/90 to-primary/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <div className="px-8 pb-8">
                    {/* Profile Avatar & Info */}
                    <div className="relative flex flex-col md:flex-row items-end md:items-center justify-between -mt-12 mb-6 gap-4">
                        <div className="flex items-end gap-6">
                            <div className="h-32 w-32 rounded-3xl bg-white dark:bg-black p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 relative z-10">
                                <div className="h-full w-full bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                                    {user?.fullName ? (
                                        <div className="h-full w-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <User className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <div className="pb-2">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.fullName || 'Admin User'}</h2>
                                <p className="text-gray-500 dark:text-gray-300 font-medium">{user?.role || 'Administrator'}</p>
                            </div>
                        </div>

                        <div className="mb-2">
                            <Button
                                variant="destructive"
                                onClick={logout}
                                className="rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Log Out
                            </Button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="glass-panel p-6 rounded-2xl border border-white/50 dark:border-white/5 flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.email || 'admin@gmail.com'}</p>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl border border-white/50 dark:border-white/5 flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Role</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg capitalize">{user?.role || 'Administrator'}</p>
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold dark:bg-green-900/30 dark:text-green-400">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SlideTransition>
    );
}

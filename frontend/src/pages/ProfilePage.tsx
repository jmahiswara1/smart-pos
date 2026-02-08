import { useAuthStore } from '../lib/auth-store';
import { Button } from '../components/ui/Button';
import { UserCircle, LogOut, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/80 to-primary/40 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="h-32 w-32 bg-white dark:bg-slate-800 rounded-full p-2">
                            <div className="h-full w-full bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.fullName ? (
                                    <div className="h-full w-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <UserCircle className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">{user?.fullName || 'Admin'}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{user?.email || 'admin@gmail.com'}</p>
                        </div>
                        <Button variant="destructive" onClick={logout} className="flex gap-2">
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </Button>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex items-start gap-4 hover:border-primary/50 transition-colors">
                            <div className="p-2">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                                <p className="font-medium">{user?.email || 'admin@gmail.com'}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex items-start gap-4 hover:border-primary/50 transition-colors">
                            <div className="p-2">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                                <p className="font-medium capitalize">{user?.role || 'Administrator'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

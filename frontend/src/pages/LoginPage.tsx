import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/axios';
import { useAuthStore } from '../lib/auth-store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { login, token, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (token && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [token, isAuthenticated, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@gmail.com',
            password: 'admin123',
        }
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setErrorMessage(''); // Clear previous errors

        try {
            const response = await api.post('/auth/login', data);
            const { access_token, user } = response.data;

            login(access_token, user);
            toast.success('Welcome back!');
            navigate('/', { replace: true });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 mb-6">
                            <img
                                src="/logo.png"
                                alt="Smart POS"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Login
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Login to continue to Smart POS
                        </p>
                    </div>

                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                                placeholder="Your email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`block w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

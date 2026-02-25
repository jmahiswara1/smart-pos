import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../lib/axios";
import { useAuthStore } from "../lib/auth-store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, Store, Mail, Lock, ArrowRight, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (token && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [token, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "admin123",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await api.post("/auth/login", data);
      const { access_token, user } = response.data;

      login(access_token, user);
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-gradient relative overflow-hidden font-display">
      {/* Abstract Shape Decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card Container */}
      <main className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] p-8 md:p-10 transition-all duration-300">

          {/* Logo / Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white rounded-xl mb-4 shadow-lg shadow-primary/30">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-primary dark:text-white">Smart POS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Please sign in to continue</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Alert */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm",
                    errors.email ? "border-red-300 focus:ring-red-200 focus:border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm",
                    errors.password ? "border-red-300 focus:ring-red-200 focus:border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span className="group-hover:hidden">Sign In</span>
                  <span className="hidden group-hover:inline-block">Login</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer / Help */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need an account?
              <a href="#" className="font-semibold text-primary dark:text-white hover:underline decoration-2 underline-offset-4 ml-1">Contact Admin</a>
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-primary transition-colors">
                <HelpCircle className="w-3 h-3" />
                <span>Help Center</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-green-600 transition-colors">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure Connection</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Branding */}
        <div className="text-center mt-6 opacity-40 hover:opacity-80 transition-opacity">
          <span className="text-xs font-medium text-primary dark:text-white tracking-widest uppercase">Powered by SmartSystems</span>
        </div>
      </main>
    </div>
  );
}

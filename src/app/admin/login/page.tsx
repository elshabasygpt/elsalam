"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("بيانات الدخول غير صحيحة");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-arabic" dir="rtl">
            {/* Left side — branding panel */}
            <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10 px-12 text-center max-w-md">
                    {/* Logo */}
                    <div className="mx-auto mb-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                        <Leaf className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-4 leading-relaxed">
                        مصنع السلام
                        <span className="block text-lg font-bold text-green-400 mt-2">
                            للزيوت النباتية
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                        لوحة تحكم متكاملة لإدارة المنتجات والمحتوى والإعدادات
                    </p>

                    {/* Feature pills */}
                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                        {["إدارة المنتجات", "محتوى الصفحات", "إعدادات الموقع", "مركز الأخبار"].map((f) => (
                            <span key={f} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-300">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side — form */}
            <div className="flex-1 flex items-center justify-center bg-[#f8f9fc] p-6">
                <div className="w-full max-w-[420px]">
                    {/* Mobile brand */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <Leaf className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-slate-800">مصنع السلام</h1>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100/80 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-800 mb-2">مرحباً بك 👋</h2>
                            <p className="text-slate-400 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs">!</span>
                                    </div>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="w-[18px] h-[18px] text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        dir="ltr"
                                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                                        placeholder="admin@elsalam.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="w-[18px] h-[18px] text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        dir="ltr"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-l from-green-600 to-green-700 text-white font-bold py-3.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        تسجيل الدخول
                                        <ArrowLeft className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        مصنع السلام للزيوت النباتية &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";

export default function LoginPage() {
    const { t, locale, isRTL } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
                setError(locale === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
            } else {
                router.push("/checkout");
                router.refresh();
            }
        } catch (err) {
            setError(locale === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <div className="absolute top-0 left-0 w-full p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-700 font-bold transition-colors">
                    <ArrowRight className={`w-5 h-5 ${isRTL ? "" : "rotate-180"}`} />
                    {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-[100px] pointer-events-none" />
                
                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">{locale === "ar" ? "مرحباً بك مجدداً" : "Welcome Back"}</h1>
                    <p className="text-slate-500 text-sm">{locale === "ar" ? "سجل دخولك لمتابعة مشترياتك وتسريع الدفع" : "Log in to track your orders and checkout faster"}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                        <div className="relative">
                            <Mail className={`w-[18px] h-[18px] text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-4" : "left-4"}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                dir="ltr"
                                className={`w-full py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm font-medium ${isRTL ? "pr-12 text-right" : "pl-12 text-left"}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "كلمة المرور" : "Password"}</label>
                        <div className="relative">
                            <Lock className={`w-[18px] h-[18px] text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-4" : "left-4"}`} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                dir="ltr"
                                className={`w-full py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm font-medium ${isRTL ? "pr-12 text-right" : "pl-12 text-left"}`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (locale === "ar" ? "تسجيل الدخول" : "Login")}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    {locale === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
                    <Link href="/register" className="text-green-600 font-bold hover:underline">
                        {locale === "ar" ? "إنشاء حساب جديد" : "Register here"}
                    </Link>
                </div>
            </div>
        </div>
    );
}

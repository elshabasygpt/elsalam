"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Phone, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";

export const QuickContactWidget = () => {
    const { t, isRTL } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Only show after scrolling down a bit
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'} flex flex-col items-end gap-4`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 ${isRTL ? 'origin-bottom-left' : 'origin-bottom-right'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900">{isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'}</h4>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <a
                                href="https://wa.me/201017400030"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-analytics="whatsapp_contact_click"
                                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-green-900 text-sm">WhatsApp</p>
                                    <p className="text-xs text-green-700">{isRTL ? 'تحدث مع المبيعات' : 'Chat with Sales'}</p>
                                </div>
                                <ArrowRight className={`w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-all ${isRTL ? 'rotate-180 -translate-x-2' : 'translate-x-2'}`} />
                            </a>

                            <a
                                href="tel:+201017400030"
                                data-analytics="phone_contact_click"
                                className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-blue-900 text-sm">{isRTL ? 'اتصال هاتفي' : 'Phone Call'}</p>
                                    <p className="text-xs text-blue-700">+20 101 740 0030</p>
                                </div>
                                <ArrowRight className={`w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-all ${isRTL ? 'rotate-180 -translate-x-2' : 'translate-x-2'}`} />
                            </a>

                            <a
                                href="mailto:trade@elsalam-packaging.com"
                                data-analytics="email_contact_click"
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                                    <p className="text-xs text-gray-600">trade@elsalam...</p>
                                </div>
                                <ArrowRight className={`w-5 h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all ${isRTL ? 'rotate-180 -translate-x-2' : 'translate-x-2'}`} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                data-analytics="contact_widget_toggle"
                className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

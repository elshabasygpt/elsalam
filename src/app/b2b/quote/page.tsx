"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { QuoteForm } from "@/components/organisms/QuoteForm";

export default function QuotePage() {
    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />
            <QuoteForm />
            <Footer />
        </main>
    );
}

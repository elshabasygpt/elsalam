"use client";

import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Leaf, Home, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-surface-soft font-arabic flex items-center justify-center">
            <Container className="text-center py-24">
                <div className="w-20 h-20 rounded-full bg-primary-green/10 flex items-center justify-center mx-auto mb-8">
                    <Leaf className="w-10 h-10 text-primary-green" />
                </div>

                <Typography variant="h1" className="text-primary-dark mb-4">
                    404
                </Typography>

                <Typography variant="h3" className="text-text-dark mb-4">
                    {t.notFound.title}
                </Typography>

                <Typography variant="body-lg" className="text-text-dark/60 max-w-md mx-auto mb-10">
                    {t.notFound.subtitle}
                </Typography>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/">
                        <Button size="lg" className="gap-2">
                            <Home className="w-5 h-5" />
                            {t.notFound.backHome}
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button size="lg" variant="outline" className="gap-2">
                            {t.notFound.browseProducts}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </main>
    );
}

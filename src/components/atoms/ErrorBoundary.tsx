"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-[400px] flex items-center justify-center py-20">
                    <Container className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <Typography variant="h3" className="text-gray-900 mb-3">
                            حدث خطأ غير متوقع
                        </Typography>
                        <Typography variant="body" className="text-gray-500 mb-6">
                            نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة لاحقاً.
                        </Typography>
                        <Button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            إعادة تحميل الصفحة
                        </Button>
                    </Container>
                </div>
            );
        }

        return this.props.children;
    }
}

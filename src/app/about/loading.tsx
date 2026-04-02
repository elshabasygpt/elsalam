import { Container } from "@/components/atoms/Container";

export default function Loading() {
    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <div className="h-20" />
            <section className="py-24">
                <Container>
                    <div className="animate-pulse space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-48 bg-gray-200 rounded-xl" />
                            <div className="h-4 w-80 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="max-w-3xl mx-auto space-y-4 mt-8">
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-5/6 bg-gray-100 rounded" />
                            <div className="h-4 w-4/5 bg-gray-100 rounded" />
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

import { Container } from "@/components/atoms/Container";

export default function Loading() {
    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            {/* Navbar skeleton */}
            <div className="h-20" />

            {/* Content skeleton */}
            <section className="py-24">
                <Container>
                    <div className="animate-pulse space-y-8">
                        {/* Title */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-64 bg-gray-200 rounded-xl" />
                            <div className="h-4 w-96 bg-gray-100 rounded-lg" />
                        </div>

                        {/* Cards grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                                    <div className="h-44 bg-gray-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 w-3/4 bg-gray-200 rounded" />
                                        <div className="h-3 w-full bg-gray-100 rounded" />
                                        <div className="h-3 w-2/3 bg-gray-100 rounded" />
                                        <div className="h-10 w-full bg-gray-200 rounded-xl mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

import { handleApiError } from "@/lib/error-handler";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [productsCount, categoriesCount] = await Promise.all([
            prisma.product.count(),
            prisma.category.count(),
        ]);

        // Experience is based on founding year (2000 as per JSON-LD)
        const experience = new Date().getFullYear() - 2000;

        return NextResponse.json({
            experience: experience,
            production: 50000, // Hardcoded based on general site info
            exports: 15,       // Hardcoded based on general site info
            clients: 250,      // Hardcoded placeholder
            lines: 8,          // Hardcoded placeholder
            certifications: 4  // ISO, HACCP, etc.
        });
    } catch (error: any) {
        return handleApiError(error);
    }
}

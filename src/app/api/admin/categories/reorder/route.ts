import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Use a transaction to update all sortOrders
        await prisma.$transaction(
            items.map((item: { id: number; sortOrder: number }) =>
                prisma.category.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder categories error:", error);
        return NextResponse.json({ error: "Failed to reorder categories" }, { status: 500 });
    }
}

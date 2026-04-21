import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id);
        const { status } = await req.json();

        if (isNaN(id) || !status) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        const order = await prisma.webOrder.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error("[ADMIN_WEB_ORDERS_PUT]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id);

        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
        }

        await prisma.webOrder.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_WEB_ORDERS_DELETE]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

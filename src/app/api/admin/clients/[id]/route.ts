import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const clientId = parseInt(id);
    if (isNaN(clientId)) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    try {
        const body = await req.json();
        const { name, company, industry, notes, contacts } = body;

        // In a real scenario, we might want to deeply update contacts.
        // The simplest approach is to delete old and create new ones.
        const client = await prisma.client.update({
            where: { id: clientId },
            data: {
                name,
                company,
                industry,
                notes,
                contacts: {
                    deleteMany: {}, // clean old
                    create: contacts?.map((c: any) => ({
                        personName: c.personName,
                        department: c.department,
                        email: c.email,
                        phone: c.phone
                    })) || []
                }
            },
            include: {
                contacts: true
            }
        });

        return NextResponse.json(client);
    } catch (error: any) {
        console.error("Update Client Error:", error);
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const clientId = parseInt(id);
    if (isNaN(clientId)) return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    try {
        await prisma.client.delete({
            where: { id: clientId }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
    }
}

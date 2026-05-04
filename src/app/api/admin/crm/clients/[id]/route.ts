import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const p = await params;
        const client = await prisma.client.findUnique({
            where: { id: parseInt(p.id) },
            include: {
                rep: { select: { name: true, email: true } },
                contacts: true
            }
        });
        
        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
        
        // SALES_REP can only access their own clients
        if (session.user.role === "SALES_REP" && client.repId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(client);
    } catch (e: any) {
        return handleApiError(e, "Failed to fetch client");
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SALES_MANAGER" && role !== "SALES_REP") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const p = await params;
        const clientId = parseInt(p.id);
        const body = await req.json();
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        
        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        // SALES_REP can only access their own clients
        if (role === "SALES_REP" && client.repId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const repId = role === "SALES_REP" ? session.user.id : (body.repId || client.repId);

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: {
                name: body.name,
                company: body.company,
                industry: body.industry,
                storeType: body.storeType,
                mainPhone: body.mainPhone,
                secondaryPhone: body.secondaryPhone,
                storeImage: body.storeImage,
                lat: body.lat ? parseFloat(body.lat) : null,
                lng: body.lng ? parseFloat(body.lng) : null,
                locationUrl: body.locationUrl,
                notes: body.notes,
                repId: repId,
                contacts: {
                    deleteMany: {},
                    create: body.contacts?.map((c: any) => ({
                        personName: c.personName || "مسئول تواصل",
                        department: c.department || "عام",
                        email: c.email,
                        phone: c.phone || ""
                    })) || []
                }
            },
            include: { contacts: true }
        });

        return NextResponse.json(updatedClient);
    } catch (e: any) {
        return handleApiError(e, "Failed to update client");
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SALES_MANAGER" && role !== "SALES_REP") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const p = await params;
        const clientId = parseInt(p.id);
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        
        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        // SALES_REP can only access their own clients
        if (role === "SALES_REP" && client.repId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.client.delete({
            where: { id: clientId }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return handleApiError(e, "Failed to delete client");
    }
}

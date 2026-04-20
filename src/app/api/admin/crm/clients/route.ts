import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SALES_MANAGER" && role !== "SALES_REP") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const url = new URL(req.url);
        const repFilter = url.searchParams.get("repId");
        
        let where: any = {};
        
        // SALES_REP can only see their own clients
        if (role === "SALES_REP") {
            where.repId = session.user.id;
        } else if (repFilter) {
            where.repId = repFilter;
        }

        const clients = await prisma.client.findMany({
            where,
            include: {
                rep: { select: { name: true, email: true } },
                contacts: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(clients);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to fetch clients", details: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SALES_MANAGER" && role !== "SALES_REP") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json();
        
        // A Sales Rep automatically assigns themselves as the rep
        // Manager/Admin can assign optionally assign someone, but default is themselves
        const repId = role === "SALES_REP" ? session.user.id : (body.repId || session.user.id);

        const newClient = await prisma.client.create({
            data: {
                name: body.name,
                company: body.company,
                industry: body.industry,
                storeType: body.storeType,
                mainPhone: body.mainPhone,
                secondaryPhone: body.secondaryPhone,
                storeImage: body.storeImage,
                lat: body.lat,
                lng: body.lng,
                locationUrl: body.locationUrl,
                notes: body.notes,
                repId: repId,
                contacts: {
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

        return NextResponse.json(newClient);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to create client", details: e.message }, { status: 500 });
    }
}

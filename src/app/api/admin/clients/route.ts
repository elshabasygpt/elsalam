import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const clients = await prisma.client.findMany({
            include: {
                contacts: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(clients);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, company, industry, notes, contacts, status, creditLimit, outstandingBalance } = body;

        if (!name) {
            return NextResponse.json({ error: "Client name is required" }, { status: 400 });
        }

        const client = await prisma.client.create({
            data: {
                name,
                company,
                industry,
                notes,
                status: status || "LEAD",
                creditLimit: Number(creditLimit) || 0,
                outstandingBalance: Number(outstandingBalance) || 0,
                contacts: {
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
        console.error("Create Client Error:", error);
        return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
    }
}

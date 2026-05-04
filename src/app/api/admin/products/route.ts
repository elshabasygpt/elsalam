import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleApiError } from "@/lib/error-handler";

// GET all products (with pagination)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "50");
    const search = searchParams.get("search") || "";

    const where: any = search ? {
        OR: [
            { name_ar: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
        ]
    } : {};

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.product.count({ where })
    ]);

    return NextResponse.json({
        data: products,
        meta: { total, page, perPage, lastPage: Math.ceil(total / perPage) }
    });
}

// POST create product
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        if (!body.name_ar || !body.name_en || !body.slug) {
            return NextResponse.json({ error: "الاسم والرابط مطلوبان" }, { status: 400 });
        }

        // ✅ Sanitize slug: lowercase, remove special chars, replace spaces with hyphens
        const sanitizedSlug = body.slug
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const existing = await prisma.product.findUnique({ where: { slug: sanitizedSlug } });
        if (existing) {
            return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name_ar: body.name_ar,
                name_en: body.name_en,
                slug: sanitizedSlug,
                short_description_ar: body.short_description_ar || null,
                short_description_en: body.short_description_en || null,
                description_ar: body.description_ar || null,
                description_en: body.description_en || null,
                price: body.price !== undefined ? body.price : null,
                price_unit_ar: body.price_unit_ar || null,
                price_unit_en: body.price_unit_en || null,
                featured_image: body.featured_image || null,
                categoryId: body.categoryId || null,
                is_featured: body.is_featured || false,
                is_exportable: body.is_exportable || false,
                // Related data
                features: body.features?.length ? {
                    create: body.features.map((f: any) => ({
                        feature_ar: f.feature_ar,
                        feature_en: f.feature_en,
                    })),
                } : undefined,
                technical_specs: body.technical_specs?.length ? {
                    create: body.technical_specs.map((s: any) => ({
                        property_ar: s.property_ar,
                        property_en: s.property_en,
                        value_ar: s.value_ar,
                        value_en: s.value_en,
                        unit_ar: s.unit_ar || null,
                        unit_en: s.unit_en || null,
                    })),
                } : undefined,
                packagings: body.packagings?.length ? {
                    create: body.packagings.map((p: any) => ({
                        size_ar: p.size_ar,
                        size_en: p.size_en,
                        price: p.price ? parseFloat(p.price) : null,
                    })),
                } : undefined,
                certifications: body.certifications?.length ? {
                    create: body.certifications.map((c: any) => ({
                        name: c.name,
                    })),
                } : undefined,
                images: body.images?.length ? {
                    create: body.images.map((i: any) => ({
                        url: i.url,
                    })),
                } : undefined,
            },
            include: {
                features: true,
                technical_specs: true,
                packagings: true,
                certifications: true,
                images: true,
            },
        });

        revalidatePath("/products");
        revalidatePath("/");

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return handleApiError(error, "CREATE_PRODUCT");
    }
}

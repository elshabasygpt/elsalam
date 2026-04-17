import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET single product with all relations
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            category: true,
            features: true,
            technical_specs: true,
            packagings: true,
            certifications: true,
        },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    try {
        const body = await req.json();

        // Check slug uniqueness (exclude current product)
        if (body.slug) {
            const existing = await prisma.product.findFirst({
                where: { slug: body.slug, NOT: { id: productId } },
            });
            if (existing) {
                return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل" }, { status: 400 });
            }
        }

        // Use transaction to update product + replace related data
        const product = await prisma.$transaction(async (tx) => {
            // Delete old related data
            await tx.productFeature.deleteMany({ where: { productId } });
            await tx.technicalSpec.deleteMany({ where: { productId } });
            await tx.productPackaging.deleteMany({ where: { productId } });
            await tx.productCertification.deleteMany({ where: { productId } });

            // Update product + create new related data
            return tx.product.update({
                where: { id: productId },
                data: {
                    name_ar: body.name_ar,
                    name_en: body.name_en,
                    slug: body.slug,
                    short_description_ar: body.short_description_ar || null,
                    short_description_en: body.short_description_en || null,
                    description_ar: body.description_ar || null,
                    description_en: body.description_en || null,
                    featured_image: body.featured_image || null,
                    categoryId: body.categoryId || null,
                    is_featured: body.is_featured || false,
                    is_exportable: body.is_exportable || false,
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
                },
                include: {
                    features: true,
                    technical_specs: true,
                    packagings: true,
                    certifications: true,
                },
            });
        });

        // ✔ Invalidate Next.js cache so frontend shows updated image immediately
        revalidatePath("/products");
        revalidatePath("/");
        revalidatePath(`/products/${product.slug}`);

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    try {
        await prisma.product.delete({ where: { id: productId } });
        // Invalidate cache after deletion
        revalidatePath("/products");
        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

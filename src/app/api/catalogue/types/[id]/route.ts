import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getClothingTypeById,
    updateClothingType,
    deleteClothingType,
} from "@/lib/services/catalogue";

const updateClothingTypeSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    minOrderQuantity: z.number().int().optional().nullable(),
    leadTime: z.string().optional().nullable(),
    sizeRange: z.string().optional().nullable(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const type = await getClothingTypeById(id);

        if (!type) {
            return NextResponse.json(
                { success: false, error: "Clothing type not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: type });
    } catch (error) {
        console.error("Failed to fetch clothing type:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch clothing type" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateClothingTypeSchema.parse(body);

        const result = await updateClothingType(id, validatedData);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Clothing type not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update clothing type:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update clothing type" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteClothingType(id);

        return NextResponse.json({ success: true, message: "Clothing type deleted" });
    } catch (error) {
        console.error("Failed to delete clothing type:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete clothing type" },
            { status: 500 }
        );
    }
}

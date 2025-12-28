import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getCatalogueItems,
    createCatalogueItem,
} from "@/lib/services/catalogue";

const createCatalogueItemSchema = z.object({
    clothingTypeId: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    minOrderQuantity: z.number().int().min(1).optional(),
    productionCapacity: z.string().optional(),
    leadTime: z.string().optional(),
    sizeRange: z.string().optional(),
    availableFabrics: z.array(z.string().uuid()).optional(),
    features: z.array(z.string()).optional(),
    specifications: z.record(z.string(), z.string()).optional(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const items = await getCatalogueItems(!includeInactive);

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Failed to fetch catalogue items:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch catalogue items" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createCatalogueItemSchema.parse(body);

        const result = await createCatalogueItem(validatedData);

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create catalogue item:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create catalogue item" },
            { status: 500 }
        );
    }
}

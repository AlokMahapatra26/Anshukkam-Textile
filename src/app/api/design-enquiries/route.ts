import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getDesignEnquiries,
    createDesignEnquiry,
    getDesignEnquiryStats,
    deleteAllDesignEnquiries,
} from "@/lib/services/design-enquiries";
import { getFabricById } from "@/lib/services/catalogue";

const createDesignEnquirySchema = z.object({
    designImageUrl: z.string(), // Can be data URL
    originalLogoUrl: z.string().nullable().optional(), // Can be data URL
    designJson: z.any().nullable().optional(),
    fabricId: z.string().uuid(),
    printType: z.string().min(1),
    quantity: z.number().int().min(1),
    sizeRange: z.string().min(1),
    phoneNumber: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || undefined;
        const statsOnly = searchParams.get("stats") === "true";

        if (statsOnly) {
            const stats = await getDesignEnquiryStats();
            return NextResponse.json({ success: true, data: stats });
        }

        const enquiriesList = await getDesignEnquiries(status);

        return NextResponse.json({ success: true, data: enquiriesList });
    } catch (error) {
        console.error("Failed to fetch design enquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch design enquiries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createDesignEnquirySchema.parse(body);

        // Fetch fabric name for reference
        const fabric = await getFabricById(validatedData.fabricId);

        if (!fabric) {
            return NextResponse.json(
                { success: false, error: "Invalid fabric" },
                { status: 400 }
            );
        }

        // Create design enquiry with fabric name stored for reference
        const result = await createDesignEnquiry({
            ...validatedData,
            fabricName: fabric.name,
            status: "pending",
        });

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation failed:", JSON.stringify(error.issues, null, 2));
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit design enquiry" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await deleteAllDesignEnquiries();
        return NextResponse.json({ success: true, message: "All design enquiries deleted" });
    } catch (error) {
        console.error("Failed to delete all design enquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete all design enquiries" },
            { status: 500 }
        );
    }
}

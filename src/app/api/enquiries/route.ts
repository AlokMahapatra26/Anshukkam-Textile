import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getEnquiries,
    createEnquiry,
    getEnquiryStats,
} from "@/lib/services/enquiries";
import {
    getClothingTypeById,
    getFabricById,
} from "@/lib/services/catalogue";
import {
    sendEnquiryNotification,
    sendEnquiryConfirmation,
} from "@/lib/services/email";

const createEnquirySchema = z.object({
    clothingTypeId: z.string().uuid(),
    fabricId: z.string().uuid(),
    quantity: z.number().int().min(0), // 0 = sample request
    sizeRange: z.string().min(1),
    phoneNumber: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    notes: z.string().optional(),
    isSampleRequest: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || undefined;
        const statsOnly = searchParams.get("stats") === "true";

        if (statsOnly) {
            const stats = await getEnquiryStats();
            return NextResponse.json({ success: true, data: stats });
        }

        const enquiriesList = await getEnquiries(status);

        return NextResponse.json({ success: true, data: enquiriesList });
    } catch (error) {
        console.error("Failed to fetch enquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch enquiries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createEnquirySchema.parse(body);

        // Fetch clothing type and fabric names for reference
        const [clothingType, fabric] = await Promise.all([
            getClothingTypeById(validatedData.clothingTypeId),
            getFabricById(validatedData.fabricId),
        ]);

        if (!clothingType) {
            return NextResponse.json(
                { success: false, error: "Invalid clothing type" },
                { status: 400 }
            );
        }

        if (!fabric) {
            return NextResponse.json(
                { success: false, error: "Invalid fabric" },
                { status: 400 }
            );
        }

        // Create enquiry with names stored for reference
        const result = await createEnquiry({
            ...validatedData,
            clothingTypeName: clothingType.name,
            fabricName: fabric.name,
            status: "pending",
        });

        // Send email notification (non-blocking)
        const emailData = {
            clothingType: clothingType.name,
            fabric: fabric.name,
            quantity: validatedData.quantity,
            sizeRange: validatedData.sizeRange,
            phoneNumber: validatedData.phoneNumber,
            email: validatedData.email,
            companyName: validatedData.companyName,
            contactPerson: validatedData.contactPerson,
            notes: validatedData.notes,
        };

        // Fire and forget email notifications
        sendEnquiryNotification(emailData).catch((err) =>
            console.error("Failed to send notification email:", err)
        );

        if (validatedData.email) {
            sendEnquiryConfirmation(validatedData.email, emailData).catch((err) =>
                console.error("Failed to send confirmation email:", err)
            );
        }

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit enquiry" },
            { status: 500 }
        );
    }
}

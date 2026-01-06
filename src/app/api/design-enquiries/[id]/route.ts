import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getDesignEnquiryById,
    updateDesignEnquiryStatus,
    deleteDesignEnquiry,
} from "@/lib/services/design-enquiries";

const updateStatusSchema = z.object({
    status: z.string().min(1),
    adminNotes: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const enquiry = await getDesignEnquiryById(id);

        if (!enquiry) {
            return NextResponse.json(
                { success: false, error: "Design enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: enquiry });
    } catch (error) {
        console.error("Failed to fetch design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch design enquiry" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, adminNotes } = updateStatusSchema.parse(body);

        const result = await updateDesignEnquiryStatus(id, status, adminNotes);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Design enquiry not found" },
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
        console.error("Failed to update design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update design enquiry" },
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
        await deleteDesignEnquiry(id);

        return NextResponse.json({ success: true, message: "Design enquiry deleted" });
    } catch (error) {
        console.error("Failed to delete design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete design enquiry" },
            { status: 500 }
        );
    }
}

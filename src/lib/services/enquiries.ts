import { db } from "@/lib/db";
import { enquiries, Enquiry, NewEnquiry } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getEnquiries(status?: string) {
    const result = await db.query.enquiries.findMany({
        where: status ? eq(enquiries.status, status) : undefined,
        orderBy: [desc(enquiries.createdAt)],
        with: {
            clothingType: true,
            fabric: true,
        },
    });
    return result;
}

export async function getEnquiryById(id: string) {
    const result = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, id),
        with: {
            clothingType: true,
            fabric: true,
        },
    });
    return result || null;
}

export async function createEnquiry(data: NewEnquiry) {
    const result = await db.insert(enquiries).values(data).returning();
    return result[0];
}

export async function updateEnquiry(id: string, data: Partial<Enquiry>) {
    const result = await db
        .update(enquiries)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(enquiries.id, id))
        .returning();
    return result[0];
}

export async function updateEnquiryStatus(
    id: string,
    status: string,
    adminNotes?: string
) {
    const updateData: Partial<Enquiry> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }

    const result = await db
        .update(enquiries)
        .set(updateData)
        .where(eq(enquiries.id, id))
        .returning();
    return result[0];
}

export async function deleteEnquiry(id: string) {
    await db.delete(enquiries).where(eq(enquiries.id, id));
}

export async function deleteAllEnquiries() {
    await db.delete(enquiries);
}

export async function getEnquiryStats() {
    const stats = await db
        .select({
            status: enquiries.status,
            count: sql<number>`count(*)::int`,
        })
        .from(enquiries)
        .groupBy(enquiries.status);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const pending = stats.find((s) => s.status === "pending")?.count || 0;
    const contacted = stats.find((s) => s.status === "contacted")?.count || 0;
    const quoted = stats.find((s) => s.status === "quoted")?.count || 0;
    const closed = stats.find((s) => s.status === "closed")?.count || 0;

    return { total, pending, contacted, quoted, closed };
}

export async function getRecentEnquiries(limit = 5) {
    const result = await db.query.enquiries.findMany({
        orderBy: [desc(enquiries.createdAt)],
        limit,
        with: {
            clothingType: true,
            fabric: true,
        },
    });
    return result;
}

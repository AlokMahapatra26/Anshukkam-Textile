import { db } from "@/lib/db";
import { designEnquiries, DesignEnquiry, NewDesignEnquiry } from "@/lib/db/schema";
import { eq, desc, sql, or, and } from "drizzle-orm";

export interface DesignEnquiryFilters {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export async function getDesignEnquiries(filters: DesignEnquiryFilters = {}) {
    const { status, priority, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status && status !== "all") {
        conditions.push(eq(designEnquiries.status, status));
    }

    if (priority && priority !== "all") {
        conditions.push(eq(designEnquiries.priority, priority));
    }

    if (search) {
        const searchLower = `%${search.toLowerCase()}%`;
        conditions.push(
            or(
                sql`lower(${designEnquiries.companyName}) like ${searchLower}`,
                sql`lower(${designEnquiries.contactPerson}) like ${searchLower}`,
                sql`lower(${designEnquiries.email}) like ${searchLower}`,
                sql`lower(${designEnquiries.phoneNumber}) like ${searchLower}`
            )
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.designEnquiries.findMany({
        where: whereClause,
        orderBy: [desc(designEnquiries.createdAt)],
        limit: limit,
        offset: offset,
        with: {
            fabric: true,
        },
    });

    // Get total count for pagination
    const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(designEnquiries)
        .where(whereClause);

    const total = Number(totalResult[0]?.count || 0);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getDesignEnquiryById(id: string) {
    const result = await db.query.designEnquiries.findFirst({
        where: eq(designEnquiries.id, id),
        with: {
            fabric: true,
        },
    });
    return result || null;
}

export async function createDesignEnquiry(data: NewDesignEnquiry) {
    const result = await db.insert(designEnquiries).values(data).returning();
    return result[0];
}

export async function updateDesignEnquiry(id: string, data: Partial<DesignEnquiry>) {
    const result = await db
        .update(designEnquiries)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(designEnquiries.id, id))
        .returning();
    return result[0];
}

export async function updateDesignEnquiryStatus(
    id: string,
    status: string,
    adminNotes?: string
) {
    const updateData: Partial<DesignEnquiry> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }

    const result = await db
        .update(designEnquiries)
        .set(updateData)
        .where(eq(designEnquiries.id, id))
        .returning();
    return result[0];
}

export async function deleteDesignEnquiry(id: string) {
    await db.delete(designEnquiries).where(eq(designEnquiries.id, id));
}

export async function deleteAllDesignEnquiries() {
    await db.delete(designEnquiries);
}

export async function getDesignEnquiryStats() {
    const stats = await db
        .select({
            status: designEnquiries.status,
            count: sql<number>`count(*)::int`,
        })
        .from(designEnquiries)
        .groupBy(designEnquiries.status);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const pending = stats.find((s) => s.status === "pending")?.count || 0;
    const contacted = stats.find((s) => s.status === "contacted")?.count || 0;
    const quoted = stats.find((s) => s.status === "quoted")?.count || 0;
    const closed = stats.find((s) => s.status === "closed")?.count || 0;

    return { total, pending, contacted, quoted, closed };
}

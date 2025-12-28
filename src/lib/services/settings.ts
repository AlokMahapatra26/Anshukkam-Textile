import { db } from "@/lib/db";
import {
    siteSettings,
    siteSections,
    SiteSetting,
    NewSiteSetting,
    SiteSection,
    NewSiteSection,
} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

// ==================== SITE SETTINGS ====================

export async function getSiteSettings() {
    return await db.select().from(siteSettings);
}

export async function getSettingByKey(key: string) {
    const result = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
    return result[0] || null;
}

export async function getSettingValue<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await getSettingByKey(key);
    return setting?.value as T ?? defaultValue;
}

export async function upsertSetting(key: string, value: unknown, description?: string) {
    const existing = await getSettingByKey(key);

    if (existing) {
        const result = await db
            .update(siteSettings)
            .set({ value, description, updatedAt: new Date() })
            .where(eq(siteSettings.key, key))
            .returning();
        return result[0];
    } else {
        const result = await db
            .insert(siteSettings)
            .values({ key, value, description })
            .returning();
        return result[0];
    }
}

export async function deleteSetting(key: string) {
    await db.delete(siteSettings).where(eq(siteSettings.key, key));
}

// ==================== SITE SECTIONS ====================

export async function getSiteSections() {
    return await db
        .select()
        .from(siteSections)
        .orderBy(asc(siteSections.displayOrder));
}

export async function getVisibleSections() {
    return await db
        .select()
        .from(siteSections)
        .where(eq(siteSections.isVisible, true))
        .orderBy(asc(siteSections.displayOrder));
}

export async function getSectionByKey(sectionKey: string) {
    const result = await db
        .select()
        .from(siteSections)
        .where(eq(siteSections.sectionKey, sectionKey))
        .limit(1);
    return result[0] || null;
}

export async function upsertSection(
    sectionKey: string,
    data: Partial<NewSiteSection>
) {
    const existing = await getSectionByKey(sectionKey);

    if (existing) {
        const result = await db
            .update(siteSections)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(siteSections.sectionKey, sectionKey))
            .returning();
        return result[0];
    } else {
        const result = await db
            .insert(siteSections)
            .values({ sectionKey, ...data })
            .returning();
        return result[0];
    }
}

export async function updateSectionVisibility(sectionKey: string, isVisible: boolean) {
    const result = await db
        .update(siteSections)
        .set({ isVisible, updatedAt: new Date() })
        .where(eq(siteSections.sectionKey, sectionKey))
        .returning();
    return result[0];
}

export async function updateSectionContent(sectionKey: string, content: unknown) {
    const result = await db
        .update(siteSections)
        .set({ content, updatedAt: new Date() })
        .where(eq(siteSections.sectionKey, sectionKey))
        .returning();
    return result[0];
}

export async function deleteSection(sectionKey: string) {
    await db.delete(siteSections).where(eq(siteSections.sectionKey, sectionKey));
}

// ==================== INITIALIZATION ====================

const DEFAULT_SECTIONS: NewSiteSection[] = [
    {
        sectionKey: "hero",
        title: "Hero Section",
        content: {
            headline: "Premium Textile Manufacturing",
            subheadline: "High-volume garment production with consistent quality",
            ctaText: "Request Quote",
        },
        isVisible: true,
        displayOrder: 1,
    },
    {
        sectionKey: "about",
        title: "About Section",
        content: {
            headline: "About Our Manufacturing",
            description: "We are a leading textile manufacturer specializing in high-volume garment production.",
            stats: [
                { label: "Years Experience", value: "25+" },
                { label: "Monthly Capacity", value: "100K+" },
                { label: "Countries Served", value: "30+" },
            ],
        },
        isVisible: true,
        displayOrder: 2,
    },
    {
        sectionKey: "catalogue",
        title: "Product Catalogue",
        content: {
            headline: "Our Product Range",
            description: "Explore our comprehensive range of garments and fabrics",
        },
        isVisible: true,
        displayOrder: 3,
    },
    {
        sectionKey: "fabrics",
        title: "Fabrics Section",
        content: {
            headline: "Premium Fabrics",
            description: "We work with high-quality fabrics from trusted suppliers",
        },
        isVisible: true,
        displayOrder: 4,
    },
    {
        sectionKey: "capacity",
        title: "Production Capacity",
        content: {
            headline: "Production Capabilities",
            items: [
                { label: "Minimum Order Quantity", value: "500 units" },
                { label: "Monthly Capacity", value: "100,000+ units" },
                { label: "Lead Time", value: "3-6 weeks" },
                { label: "Size Range", value: "XS - 5XL" },
            ],
        },
        isVisible: true,
        displayOrder: 5,
    },
    {
        sectionKey: "enquiry",
        title: "Enquiry Form",
        content: {
            headline: "Request a Quote",
            description: "Fill out the form below and we'll get back to you within 24 hours",
        },
        isVisible: true,
        displayOrder: 6,
    },
    {
        sectionKey: "contact",
        title: "Contact Section",
        content: {
            headline: "Contact Us",
            email: "info@manufacturer.com",
            phone: "+1 234 567 890",
            address: "123 Industrial Area, Manufacturing City",
        },
        isVisible: true,
        displayOrder: 7,
    },
];

const DEFAULT_SETTINGS: NewSiteSetting[] = [
    {
        key: "company_name",
        value: "Premium Textiles Mfg.",
        description: "Company name displayed on the website",
    },
    {
        key: "company_tagline",
        value: "Quality Garments, High Volume",
        description: "Tagline displayed on the website",
    },
    {
        key: "company_logo",
        value: null,
        description: "Company logo URL",
    },
    {
        key: "contact_email",
        value: "info@manufacturer.com",
        description: "Primary contact email",
    },
    {
        key: "contact_phone",
        value: "+1 234 567 890",
        description: "Primary contact phone",
    },
    {
        key: "social_links",
        value: {
            linkedin: "",
            facebook: "",
            instagram: "",
        },
        description: "Social media links",
    },
];

export async function initializeDefaultSettings() {
    // Initialize sections
    for (const section of DEFAULT_SECTIONS) {
        const existing = await getSectionByKey(section.sectionKey!);
        if (!existing) {
            await db.insert(siteSections).values(section);
        }
    }

    // Initialize settings
    for (const setting of DEFAULT_SETTINGS) {
        const existing = await getSettingByKey(setting.key);
        if (!existing) {
            await db.insert(siteSettings).values(setting);
        }
    }
}

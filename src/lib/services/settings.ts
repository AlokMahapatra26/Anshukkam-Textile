import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const SETTING_KEY = "about_page";

// Default content structure
const defaultContent = {
    hero: {
        title: "Where Fabric Meets Emotion",
        description: "A dream that started with passion and dedication has now taken shape into a professional garment manufacturing unit."
    },
    mission: {
        quote: "Every stitch, every thread, and every design reflects our belief — quality isn't just made, it's crafted with care.",
        description: "From fabric checking to final dispatch, we bring together skill, precision, and trust under one roof. Proudly based in Neemuch (M.P.), we're here to deliver excellence in every piece we create."
    },
    story: {
        title: "Meet the Founders",
        content: [
            "Behind every strong brand, there's a story stitched with courage, consistency, and belief.",
            "Ours began with two minds, one vision — to build something meaningful. A dream company built together, where passion becomes partnership and the result is pure creation.",
            "Together, we are shaping Anshuukam Textile Pvt Ltd — a space where fabric meets emotion, and quality meets trust."
        ],
        founders: [
            { name: "Purva Jain", role: "Director", id: "01", imageUrl: "" },
            { name: "Sanath Sharma", role: "Director", id: "02", imageUrl: "" }
        ]
    },
    values: {
        title: "What We Stand For",
        description: "This is more than a company — it's a journey woven with hard work, vision, and dreams come true.",
        items: [
            {
                id: "VAL-01",
                title: "Crafted with Care",
                description: "Every garment goes through meticulous quality checks. We believe quality isn't just made — it's crafted.",
                icon: "Sparkles"
            },
            {
                id: "VAL-02",
                title: "Precision & Trust",
                description: "From fabric selection to final dispatch, we bring together skill, precision, and trust under one roof.",
                icon: "Shield"
            },
            {
                id: "VAL-03",
                title: "Partnership",
                description: "When passion becomes partnership, the result is pure creation. We grow together with our clients.",
                icon: "Users"
            }
        ]
    },
    company_info: {
        location: "Neemuch, Madhya Pradesh, India",
        name: "Anshuukam Textile Private Limited",
        gstin: "23ABBCA8915B1Z5"
    },
    cta: {
        title: "Ready to create something beautiful?",
        description: "Let's bring your vision to life. Get in touch to discuss your requirements."
    }
};

export const getAboutPageSettings = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, SETTING_KEY),
            });

            if (!setting) {
                return defaultContent;
            }

            return setting.value as typeof defaultContent;
        } catch (error) {
            console.error("Failed to fetch about page settings:", error);
            return defaultContent;
        }
    },
    ["about-page-settings"],
    {
        tags: ["about-page"],
        revalidate: false // Cache indefinitely until revalidated
    }
);

export const getSiteSettings = unstable_cache(
    async () => {
        try {
            return await db.query.siteSettings.findMany();
        } catch (error) {
            console.error("Failed to fetch site settings:", error);
            return [];
        }
    },
    ["site-settings"],
    {
        tags: ["settings"],
        revalidate: 3600 // Revalidate every hour
    }
);

export const getSettingByKey = unstable_cache(
    async (key: string) => {
        try {
            return await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, key),
            });
        } catch (error) {
            console.error(`Failed to fetch setting ${key}:`, error);
            return null;
        }
    },
    ["setting-by-key"],
    {
        tags: ["settings"],
        revalidate: 3600
    }
);

export const upsertSetting = async (key: string, value: unknown, description?: string) => {
    try {
        const existing = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, key),
        });

        if (existing) {
            return await db
                .update(siteSettings)
                .set({
                    value,
                    description: description || existing.description,
                    updatedAt: new Date(),
                })
                .where(eq(siteSettings.key, key))
                .returning();
        } else {
            return await db
                .insert(siteSettings)
                .values({
                    key,
                    value,
                    description,
                })
                .returning();
        }
    } catch (error) {
        console.error(`Failed to upsert setting ${key}:`, error);
        throw error;
    }
};

export async function getSettingValue<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await getSettingByKey(key);
    if (!setting || setting.value === null || setting.value === undefined) {
        return defaultValue;
    }
    return setting.value as T;
}

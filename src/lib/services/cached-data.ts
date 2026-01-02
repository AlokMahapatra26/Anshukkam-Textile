import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
    clothingTypes,
    fabrics,
    factoryPhotos,
    siteSettings,
} from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";

// ==================== CLOTHING TYPES ====================

export const getCachedClothingTypes = unstable_cache(
    async () => {
        const types = await db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.isActive, true))
            .orderBy(asc(clothingTypes.displayOrder));
        return types;
    },
    ["clothing-types"],
    {
        tags: ["catalogue"],
        revalidate: 43200, // 12 hours fallback
    }
);

export const getCachedClothingTypeBySlug = unstable_cache(
    async (slug: string) => {
        const result = await db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.slug, slug))
            .limit(1);
        return result[0] || null;
    },
    ["clothing-type-by-slug"],
    {
        tags: ["catalogue"],
        revalidate: 43200,
    }
);

// ==================== FABRICS ====================

export const getCachedFabrics = unstable_cache(
    async () => {
        const fabricList = await db
            .select()
            .from(fabrics)
            .where(eq(fabrics.isActive, true))
            .orderBy(asc(fabrics.displayOrder));
        return fabricList;
    },
    ["fabrics"],
    {
        tags: ["fabrics"],
        revalidate: 43200,
    }
);

export const getCachedFabricBySlug = unstable_cache(
    async (slug: string) => {
        const result = await db
            .select()
            .from(fabrics)
            .where(eq(fabrics.slug, slug))
            .limit(1);
        return result[0] || null;
    },
    ["fabric-by-slug"],
    {
        tags: ["fabrics"],
        revalidate: 43200,
    }
);

// ==================== FACTORY PHOTOS ====================

export const getCachedFactoryPhotos = unstable_cache(
    async () => {
        const photos = await db
            .select()
            .from(factoryPhotos)
            .where(eq(factoryPhotos.isActive, true))
            .orderBy(asc(factoryPhotos.displayOrder), desc(factoryPhotos.createdAt));
        return photos;
    },
    ["factory-photos"],
    {
        tags: ["factory"],
        revalidate: 43200,
    }
);

// ==================== SETTINGS ====================

export const getCachedCapacityStats = unstable_cache(
    async () => {
        const result = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.key, "capacity_stats"))
            .limit(1);

        const setting = result[0];
        if (setting && setting.value && Array.isArray(setting.value)) {
            return setting.value as Array<{
                icon: string;
                value: string;
                label: string;
                description: string;
            }>;
        }

        // Return default stats if not found
        return [
            { icon: "Package", value: "500", label: "Minimum Order Qty", description: "Units per style" },
            { icon: "TrendingUp", value: "100K+", label: "Monthly Capacity", description: "Units production" },
            { icon: "Clock", value: "3-6", label: "Lead Time", description: "Weeks to delivery" },
            { icon: "Ruler", value: "XS-5XL", label: "Size Range", description: "Full size coverage" },
            { icon: "Layers", value: "50+", label: "Fabric Options", description: "Premium materials" },
            { icon: "Award", value: "25+", label: "Years Experience", description: "In the industry" },
        ];
    },
    ["capacity-stats"],
    {
        tags: ["settings"],
        revalidate: 43200,
    }
);

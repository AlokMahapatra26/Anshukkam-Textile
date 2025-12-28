import "dotenv/config";
import { db } from "../src/lib/db";
import { siteSections } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

const defaultSections = [
    { sectionKey: "hero", title: "Hero Section", isVisible: true, displayOrder: 1 },
    { sectionKey: "capacity", title: "Production Capabilities", isVisible: true, displayOrder: 2 },
    { sectionKey: "catalogue", title: "Product Catalogue", isVisible: true, displayOrder: 3 },
    { sectionKey: "fabrics", title: "Fabric Options", isVisible: true, displayOrder: 4 },
    { sectionKey: "cta", title: "Call to Action", isVisible: true, displayOrder: 5 },
];

async function seedSections() {
    console.log("Seeding site sections...\n");

    for (const section of defaultSections) {
        try {
            // Check if section exists
            const existing = await db.execute(
                sql`SELECT id FROM site_sections WHERE section_key = ${section.sectionKey}`
            );

            if (existing.rows.length === 0) {
                await db.insert(siteSections).values(section);
                console.log(`✓ Added section: ${section.title}`);
            } else {
                console.log(`- Section already exists: ${section.title}`);
            }
        } catch (error) {
            console.error(`✗ Failed to add section ${section.sectionKey}:`, error);
        }
    }

    console.log("\n✅ Seeding completed!");
    process.exit(0);
}

seedSections().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});

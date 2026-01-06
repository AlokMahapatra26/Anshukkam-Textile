import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCachedFactoryPhotos } from "@/lib/services/cached-data";
import { Metadata } from "next";
import { FactoryGallery } from "@/components/public/FactoryGallery";

export const metadata: Metadata = {
    title: "Our Factory | Anshukkam Textile",
    description: "Take a virtual tour of our state-of-the-art manufacturing facility. 50,000+ sq ft production space, 200+ skilled workers, 24/7 production capability.",
};

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
}

const categoryLabels: Record<string, string> = {
    production: "Production Floor",
    warehouse: "Warehouse",
    "quality-control": "Quality Control",
    machinery: "Machinery",
    office: "Office",
    exterior: "Exterior",
    team: "Our Team",
    other: "Other",
};

export default async function FactoryPage() {
    const photos = await getCachedFactoryPhotos() as FactoryPhoto[];

    // Get unique categories from photos
    const categories = Array.from(new Set(photos.map((p) => p.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-2xl md:text-3xl font-medium mb-3">
                            Our Factory
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light">
                            Take a virtual tour of our state-of-the-art manufacturing facility
                            with 50,000+ sq ft of production space.
                        </p>
                    </div>
                </div>
            </section>

            {/* Factory Stats */}
            <section className="bg-muted py-12">
                <div className="container-industrial">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "50,000+", label: "Sq Ft Facility" },
                            { value: "200+", label: "Skilled Workers" },
                            { value: "24/7", label: "Production" },
                            { value: "100%", label: "Quality Checked" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="text-center p-6 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Inside Our Facility
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our manufacturing facility through these photos.
                            From cutting-edge machinery to our dedicated team, see what makes us different.
                        </p>
                    </div>

                    {/* Interactive Gallery */}
                    <FactoryGallery
                        photos={photos}
                        categories={categories}
                        categoryLabels={categoryLabels}
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Want to Visit Our Factory?
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                        Schedule a factory tour to see our production processes firsthand
                        and meet our dedicated team.
                    </p>
                    <Link href="/contact">
                        <Button variant="secondary" size="lg">
                            Schedule a Tour
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

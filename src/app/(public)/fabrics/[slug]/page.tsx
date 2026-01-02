import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Layers, Scale, CheckCircle, ArrowRight
} from "lucide-react";
import { getCachedFabrics, getCachedFabricBySlug } from "@/lib/services/cached-data";
import { Metadata } from "next";
import { FabricImageGallery } from "@/components/public/FabricImageGallery";

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    properties: Record<string, boolean> | null;
    imageUrl: string | null;
    images: string[] | null;
}

const propertyLabels: Record<string, string> = {
    breathable: "Breathable",
    moisture_wicking: "Moisture Wicking",
    stretchable: "Stretchable",
    durable: "Durable",
    wrinkle_resistant: "Wrinkle Resistant",
    uv_protection: "UV Protection",
    quick_dry: "Quick Dry",
    anti_bacterial: "Anti-Bacterial",
};

// Generate static pages for all fabrics at build time
export async function generateStaticParams() {
    const fabricList = await getCachedFabrics();
    return fabricList.map((fabric: { slug: string }) => ({
        slug: fabric.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const fabric = await getCachedFabricBySlug(slug) as Fabric | null;

    if (!fabric) {
        return { title: "Fabric Not Found" };
    }

    return {
        title: `${fabric.name} Fabric | Anshukkam Textile`,
        description: fabric.description || `Premium ${fabric.name} fabric. Composition: ${fabric.composition || "N/A"}. Weight: ${fabric.weight || "N/A"}.`,
    };
}

export default async function FabricDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const fabric = await getCachedFabricBySlug(slug) as Fabric | null;

    if (!fabric) {
        notFound();
    }

    const activeProperties = fabric?.properties
        ? Object.entries(fabric.properties).filter(([_, value]) => value)
        : [];

    // Prepare images list for gallery
    const galleryImages = fabric.images && fabric.images.length > 0
        ? fabric.images
        : fabric.imageUrl
            ? [fabric.imageUrl]
            : [];

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-muted border-b border-border">
                <div className="container-industrial py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <Link href="/fabrics" className="text-muted-foreground hover:text-foreground transition-colors">
                            Fabrics
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{fabric.name}</span>
                    </div>
                </div>
            </div>

            {/* Fabric Details */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <FabricImageGallery
                            images={galleryImages}
                            fabricName={fabric.name}
                        />

                        {/* Fabric Info */}
                        <div className="space-y-8">
                            <div>
                                <Badge variant="outline" className="mb-4 text-accent border-accent/20 bg-accent/5">
                                    Premium Fabric
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                                    {fabric.name}
                                </h1>
                                {fabric.description && (
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {fabric.description}
                                    </p>
                                )}
                            </div>

                            {/* Specifications */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-5 rounded-lg border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Layers className="h-5 w-5 text-accent" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Composition</span>
                                    </div>
                                    <div className="font-semibold text-xl">
                                        {fabric.composition || "100% Cotton"}
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-5 rounded-lg border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Scale className="h-5 w-5 text-accent" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight</span>
                                    </div>
                                    <div className="font-semibold text-xl">
                                        {fabric.weight || "180 GSM"}
                                    </div>
                                </div>
                            </div>

                            {/* Properties */}
                            {activeProperties.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Fabric Properties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activeProperties.map(([key]) => (
                                            <Badge
                                                key={key}
                                                variant="secondary"
                                                className="px-4 py-2 text-sm border border-border"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                                                {propertyLabels[key] || key.replace(/_/g, " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                                <Link href="/enquiry" className="flex-1">
                                    <Button className="btn-industrial w-full h-12 text-lg" size="lg">
                                        Request Sample
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg" className="h-12 text-lg px-8">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Fabrics */}
            <section className="bg-muted py-8 border-t border-border">
                <div className="container-industrial">
                    <Link href="/fabrics">
                        <Button variant="ghost" className="group hover:bg-transparent pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Fabrics
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

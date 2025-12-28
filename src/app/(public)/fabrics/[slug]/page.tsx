"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2, ArrowLeft, Layers, Scale, CheckCircle,
    ArrowRight, ZoomIn, Droplets, Wind, Shield
} from "lucide-react";

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    properties: Record<string, boolean> | null;
    imageUrl: string | null;
}

const propertyIcons: Record<string, React.ElementType> = {
    breathable: Wind,
    moisture_wicking: Droplets,
    stretchable: Layers,
    durable: Shield,
};

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

export default function FabricDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [fabric, setFabric] = useState<Fabric | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchFabric() {
            try {
                const response = await fetch(`/api/catalogue/fabrics/${slug}`);
                const result = await response.json();
                if (result.success) {
                    setFabric(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch fabric:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (slug) fetchFabric();
    }, [slug]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const activeProperties = fabric?.properties
        ? Object.entries(fabric.properties).filter(([_, value]) => value)
        : [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!fabric) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Fabric Not Found</h1>
                <Link href="/fabrics">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Fabrics
                    </Button>
                </Link>
            </div>
        );
    }

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
                        {/* Image with Zoom for fabric texture */}
                        <div className="space-y-4">
                            <div
                                ref={imageRef}
                                className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in group"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {fabric.imageUrl ? (
                                    <>
                                        <img
                                            src={fabric.imageUrl}
                                            alt={fabric.name}
                                            className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? "scale-200" : "scale-100"
                                                }`}
                                            style={isZoomed ? {
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                transform: "scale(2.5)"
                                            } : {}}
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ZoomIn className="h-4 w-4" />
                                            Hover to see texture
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Layers className="h-24 w-24 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Zoom hint */}
                            <p className="text-sm text-muted-foreground text-center">
                                Hover over the image to inspect fabric texture in detail
                            </p>
                        </div>

                        {/* Fabric Info */}
                        <div className="space-y-6">
                            <div>
                                <Badge variant="outline" className="mb-3">
                                    Premium Fabric
                                </Badge>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">
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
                                <div className="bg-muted p-5 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Layers className="h-5 w-5 text-accent" />
                                        <span className="text-sm text-muted-foreground">Composition</span>
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {fabric.composition || "100% Cotton"}
                                    </div>
                                </div>
                                <div className="bg-muted p-5 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Scale className="h-5 w-5 text-accent" />
                                        <span className="text-sm text-muted-foreground">Weight</span>
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {fabric.weight || "180 GSM"}
                                    </div>
                                </div>
                            </div>

                            {/* Properties */}
                            {activeProperties.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Fabric Properties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activeProperties.map(([key]) => (
                                            <Badge
                                                key={key}
                                                variant="secondary"
                                                className="px-4 py-2 text-sm"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                                                {propertyLabels[key] || key.replace(/_/g, " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/enquiry" className="flex-1">
                                    <Button className="btn-industrial w-full" size="lg">
                                        Request Sample
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Fabrics */}
            <section className="bg-muted py-8">
                <div className="container-industrial">
                    <Link href="/fabrics">
                        <Button variant="ghost" className="group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Fabrics
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

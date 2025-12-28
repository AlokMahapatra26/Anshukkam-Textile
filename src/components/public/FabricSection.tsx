"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers, Loader2, Check, ArrowRight, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    imageUrl: string | null;
}

export function FabricSection() {
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/catalogue/fabrics");
                const result = await response.json();
                if (result.success) {
                    setFabrics(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch fabrics:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <section className="section-industrial-alt">
                <div className="container-industrial">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </div>
            </section>
        );
    }

    if (fabrics.length === 0) {
        return null;
    }

    return (
        <section className="section-industrial-alt bg-[#fafafa]">
            <div className="container-industrial">
                {/* Section Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-sm font-medium text-accent uppercase tracking-wider mb-2 block">
                            Material Options
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Available Fabrics
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Quality-tested materials from certified suppliers.
                            All fabrics available in bulk quantities.
                        </p>
                    </div>
                    <Link href="/fabrics">
                        <Button variant="outline" className="btn-industrial-outline">
                            View All Fabrics
                        </Button>
                    </Link>
                </div>

                {/* Fabric Grid - Textile Card Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fabrics.slice(0, 4).map((fabric) => (
                        <Link
                            key={fabric.id}
                            href={`/fabrics/${fabric.slug}`}
                            className="group bg-white p-4 rounded-sm shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Fabric Swatch Look */}
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-sm bg-muted shadow-inner">
                                {fabric.imageUrl ? (
                                    <Image
                                        src={fabric.imageUrl}
                                        alt={fabric.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                        <Layers className="h-12 w-12 text-muted-foreground/20" />
                                    </div>
                                )}

                                {/* Texture Overlay Effect */}
                                <div className="absolute inset-0 bg-[url('/texture-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                                {/* Hover Info */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-medium border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            {/* Fabric Info Card */}
                            <div className="relative">
                                {/* Pinking Shears Edge Effect (CSS) */}
                                <div className="absolute -top-6 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_2px,#fff_2px)] bg-[length:6px_6px] -mt-1" />

                                <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                                    {fabric.name}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <span className="px-2 py-0.5 bg-muted rounded-full">
                                        {fabric.composition || "N/A"}
                                    </span>
                                    <span>•</span>
                                    <span>{fabric.weight || "N/A"}</span>
                                </div>

                                <div className="flex items-center text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Explore Fabric <ArrowRight className="h-3 w-3 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Scroll className="h-4 w-4" />
                    <p>
                        Don't see what you need? We can source custom fabrics for bulk orders.
                    </p>
                    <Link href="/contact" className="text-accent hover:underline font-medium">
                        Contact Sourcing Team
                    </Link>
                </div>
            </div>
        </section>
    );
}

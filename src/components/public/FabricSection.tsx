"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, Loader2, Check } from "lucide-react";
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
        <section className="section-industrial-alt">
            <div className="container-industrial">
                {/* Section Header */}
                <div className="mb-12">
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

                {/* Fabric Table/Grid - Industrial Style */}
                <div className="border border-border overflow-hidden">
                    {/* Header Row */}
                    <div className="hidden md:grid md:grid-cols-5 bg-primary text-primary-foreground text-sm font-medium">
                        <div className="p-4 border-r border-primary-foreground/20">Fabric Type</div>
                        <div className="p-4 border-r border-primary-foreground/20">Composition</div>
                        <div className="p-4 border-r border-primary-foreground/20">Weight</div>
                        <div className="p-4 border-r border-primary-foreground/20">Properties</div>
                        <div className="p-4">Sample</div>
                    </div>

                    {/* Fabric Rows */}
                    {fabrics.map((fabric, index) => (
                        <div
                            key={fabric.id}
                            className={`grid grid-cols-1 md:grid-cols-5 border-b border-border last:border-b-0 ${index % 2 === 0 ? "bg-card" : "bg-muted/30"
                                }`}
                        >
                            {/* Fabric Name */}
                            <div className="p-4 md:border-r border-border">
                                <div className="flex items-center gap-3">
                                    <Layers className="h-5 w-5 text-accent flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">{fabric.name}</p>
                                        <p className="text-xs text-muted-foreground md:hidden">
                                            {fabric.composition}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Composition */}
                            <div className="hidden md:flex p-4 border-r border-border items-center">
                                <p className="text-sm">{fabric.composition || "—"}</p>
                            </div>

                            {/* Weight */}
                            <div className="hidden md:flex p-4 border-r border-border items-center">
                                <p className="text-sm font-medium">{fabric.weight || "—"}</p>
                            </div>

                            {/* Properties */}
                            <div className="hidden md:flex p-4 border-r border-border items-center">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center text-xs">
                                        <Check className="h-3 w-3 mr-1 text-green-500" />
                                        Quality Tested
                                    </span>
                                </div>
                            </div>

                            {/* Image/Sample */}
                            <div className="hidden md:flex p-4 items-center">
                                {fabric.imageUrl ? (
                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-muted border border-border">
                                        <Image
                                            src={fabric.imageUrl}
                                            alt={fabric.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">On Request</span>
                                )}
                            </div>

                            {/* Mobile: Additional Info */}
                            <div className="md:hidden p-4 pt-0 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Weight: {fabric.weight || "—"}
                                </span>
                                {fabric.imageUrl && (
                                    <div className="relative h-8 w-12 rounded overflow-hidden bg-muted">
                                        <Image
                                            src={fabric.imageUrl}
                                            alt={fabric.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Custom fabric sourcing available for bulk orders.
                        Contact us for specific material requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button variant="outline" className="btn-industrial-outline">
                            Request Fabric Samples
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

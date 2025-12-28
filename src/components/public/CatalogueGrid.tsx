"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, Ruler, Shirt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClothingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
}

export function CatalogueGrid() {
    const [types, setTypes] = useState<ClothingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/catalogue/types");
                const result = await response.json();
                if (result.success) {
                    setTypes(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch types:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </div>
            </section>
        );
    }

    if (types.length === 0) {
        return null;
    }

    return (
        <section className="section-industrial">
            <div className="container-industrial">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="text-sm font-medium text-accent uppercase tracking-wider mb-2 block">
                            Manufacturing Capabilities
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Product Categories
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Full-service garment manufacturing from design to delivery.
                            All categories available with custom specifications.
                        </p>
                    </div>
                    <Link href="/enquiry">
                        <Button className="btn-industrial">
                            Request Quote
                        </Button>
                    </Link>
                </div>

                {/* Industrial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-border">
                    {types.map((item) => (
                        <div
                            key={item.id}
                            className="bg-card p-6 hover:bg-muted/50 transition-colors"
                        >
                            {/* Image or Icon */}
                            <div className="aspect-[16/10] bg-muted mb-6 relative overflow-hidden border border-border">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Shirt className="h-12 w-12 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>

                            {item.description && (
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            {/* Manufacturing Specs - Now using real data */}
                            <div className="grid grid-cols-3 gap-4 py-4 border-t border-border text-center">
                                <div>
                                    <Package className="h-4 w-4 mx-auto mb-1 text-accent" />
                                    <p className="text-xs text-muted-foreground">MOQ</p>
                                    <p className="text-sm font-semibold">{item.minOrderQuantity || 500}+</p>
                                </div>
                                <div>
                                    <Clock className="h-4 w-4 mx-auto mb-1 text-accent" />
                                    <p className="text-xs text-muted-foreground">Lead Time</p>
                                    <p className="text-sm font-semibold">{item.leadTime || "3-5 Weeks"}</p>
                                </div>
                                <div>
                                    <Ruler className="h-4 w-4 mx-auto mb-1 text-accent" />
                                    <p className="text-xs text-muted-foreground">Sizes</p>
                                    <p className="text-sm font-semibold">{item.sizeRange || "XS-5XL"}</p>
                                </div>
                            </div>

                            {/* CTA */}
                            <Link href="/enquiry">
                                <Button variant="outline" className="w-full mt-4 btn-industrial-outline">
                                    Get Quote
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 p-6 bg-muted border border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold">Need custom specifications?</p>
                        <p className="text-sm text-muted-foreground">
                            We can manufacture any garment type to your exact requirements.
                        </p>
                    </div>
                    <Link href="/enquiry">
                        <Button className="btn-industrial">
                            Contact Sales Team
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

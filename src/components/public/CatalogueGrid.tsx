"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, Ruler, Shirt, Loader2, Scissors, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";

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
                {/* Industrial Grid */}
                <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {types.map((item) => (
                        <FadeInItem key={item.id}>
                            <Link
                                href={`/catalogue/${item.slug}`}
                                className="group relative bg-card overflow-hidden border-stitch border-stitch-hover rounded-lg block h-full"
                            >
                                {/* Decorative Stitching Pattern */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -left-1 top-4 bottom-4 w-[2px] border-l border-dashed border-muted-foreground/20 group-hover:border-accent/50 transition-colors" />
                                <div className="absolute -right-1 top-4 bottom-4 w-[2px] border-r border-dashed border-muted-foreground/20 group-hover:border-accent/50 transition-colors" />

                                <div className="p-6">
                                    {/* Image or Icon */}
                                    <div className="aspect-[4/3] bg-muted mb-6 relative overflow-hidden rounded-sm border border-border group-hover:border-accent/30 transition-colors">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                <Scissors className="h-12 w-12 text-muted-foreground/20" />
                                            </div>
                                        )}

                                        {/* Overlay Tag */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-primary border border-primary/10 shadow-sm">
                                            {item.minOrderQuantity || 500}+ MOQ
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                                                {item.name}
                                            </h3>
                                            <PenTool className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Specs */}
                                        <div className="pt-4 mt-4 border-t border-dashed border-border grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{item.leadTime || "3-5 Weeks"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Ruler className="h-3 w-3" />
                                                <span>{item.sizeRange || "XS-5XL"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeInItem>
                    ))}
                </FadeInStagger>


            </div>
        </section>
    );
}

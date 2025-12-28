"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, Ruler, Shirt, Loader2, Scissors, PenTool } from "lucide-react";
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

export default function CataloguePage() {
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

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-24 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Product Catalogue</h1>
                        <p className="text-xl text-primary-foreground/80 leading-relaxed">
                            Explore our full range of garment categories. Each product can be
                            customized to your specifications.
                        </p>
                    </div>
                </div>
            </section>

            {/* Catalogue Grid */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : types.length === 0 ? (
                        <div className="text-center py-16">
                            <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No products yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Check back soon for our product catalogue.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Contact Us</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {types.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/catalogue/${item.slug}`}
                                    className="group relative bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-accent"
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
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

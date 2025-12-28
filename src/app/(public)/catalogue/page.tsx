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
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Catalogue</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl">
                        Explore our full range of garment categories. Each product can be
                        customized to your specifications.
                    </p>
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
                                <div
                                    key={item.id}
                                    className="bg-card border border-border p-6 hover:border-accent transition-colors"
                                >
                                    {/* Image */}
                                    <div className="aspect-[16/10] bg-muted mb-6 relative overflow-hidden">
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
                                    <h2 className="text-xl font-bold mb-2">{item.name}</h2>

                                    {item.description && (
                                        <p className="text-muted-foreground mb-6">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Specs */}
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
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Need a custom product?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        We can manufacture any garment type to your exact specifications.
                        Contact us to discuss your requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button className="btn-industrial">Request Custom Quote</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

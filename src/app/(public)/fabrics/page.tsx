"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers, Check, Loader2 } from "lucide-react";
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

export default function FabricsPage() {
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

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Fabric Options</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl">
                        Quality-tested materials from certified suppliers. All fabrics
                        available in bulk quantities.
                    </p>
                </div>
            </section>

            {/* Fabrics Grid */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : fabrics.length === 0 ? (
                        <div className="text-center py-16">
                            <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No fabrics listed yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Contact us to discuss your fabric requirements.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Contact Us</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fabrics.map((fabric) => (
                                <div
                                    key={fabric.id}
                                    className="bg-card border border-border p-6 hover:border-accent transition-colors"
                                >
                                    {/* Image */}
                                    {fabric.imageUrl && (
                                        <div className="aspect-video relative mb-4 overflow-hidden bg-muted">
                                            <Image
                                                src={fabric.imageUrl}
                                                alt={fabric.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            {!fabric.imageUrl && (
                                                <Layers className="h-6 w-6 text-accent flex-shrink-0" />
                                            )}
                                            <h2 className="text-xl font-bold">{fabric.name}</h2>
                                        </div>
                                        {fabric.weight && (
                                            <span className="text-sm text-accent font-medium bg-accent/10 px-2 py-1 rounded">
                                                {fabric.weight}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {fabric.description && (
                                        <p className="text-muted-foreground mb-4">
                                            {fabric.description}
                                        </p>
                                    )}

                                    {/* Composition */}
                                    {fabric.composition && (
                                        <div className="mb-4">
                                            <span className="text-sm font-medium">Composition: </span>
                                            <span className="text-sm text-muted-foreground">
                                                {fabric.composition}
                                            </span>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="inline-flex items-center text-xs text-muted-foreground">
                                            <Check className="h-3 w-3 mr-1 text-green-500" />
                                            Quality Tested
                                        </span>
                                        <span className="inline-flex items-center text-xs text-muted-foreground">
                                            <Check className="h-3 w-3 mr-1 text-green-500" />
                                            Bulk Available
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Need custom fabric sourcing?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        We can source any fabric type for your order.
                        Contact us with your specific requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button className="btn-industrial">Request Fabric Samples</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

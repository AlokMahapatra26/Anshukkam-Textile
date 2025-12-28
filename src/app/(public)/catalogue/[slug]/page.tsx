"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2, ArrowLeft, Package, Clock, Ruler,
    CheckCircle, ArrowRight, ZoomIn
} from "lucide-react";

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

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [product, setProduct] = useState<ClothingType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`/api/catalogue/types/${slug}`);
                const result = await response.json();
                if (result.success) {
                    setProduct(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (slug) fetchProduct();
    }, [slug]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/catalogue">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Catalogue
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
                        <Link href="/catalogue" className="text-muted-foreground hover:text-foreground transition-colors">
                            Catalogue
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image with Zoom */}
                        <div className="space-y-4">
                            <div
                                ref={imageRef}
                                className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in group"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {product.imageUrl ? (
                                    <>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"
                                                }`}
                                            style={isZoomed ? {
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                            } : {}}
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ZoomIn className="h-4 w-4" />
                                            Hover to zoom
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-24 w-24 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <Badge variant="outline" className="mb-3">
                                    Product
                                </Badge>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                    {product.name}
                                </h1>
                                {product.description && (
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <Package className="h-6 w-6 mx-auto mb-2 text-accent" />
                                    <div className="font-bold text-lg">
                                        {product.minOrderQuantity?.toLocaleString() || "500"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Min. Order Qty</div>
                                </div>
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                                    <div className="font-bold text-lg">
                                        {product.leadTime || "3-5 Weeks"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Lead Time</div>
                                </div>
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <Ruler className="h-6 w-6 mx-auto mb-2 text-accent" />
                                    <div className="font-bold text-lg">
                                        {product.sizeRange || "XS-5XL"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Size Range</div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/enquiry" className="flex-1">
                                    <Button className="btn-industrial w-full" size="lg">
                                        Request Quote
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

            {/* Back to Catalogue */}
            <section className="bg-muted py-8">
                <div className="container-industrial">
                    <Link href="/catalogue">
                        <Button variant="ghost" className="group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Catalogue
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2, ArrowLeft, Package, Clock, Ruler,
    ArrowRight, ZoomIn
} from "lucide-react";
import Image from "next/image";

interface ClothingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    images: string[] | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
}

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [product, setProduct] = useState<ClothingType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`/api/catalogue/types/${slug}`);
                const result = await response.json();
                if (result.success) {
                    const data = result.data;
                    setProduct(data);
                    // Set initial active image
                    if (data.images && data.images.length > 0) {
                        setActiveImage(data.images[0]);
                    } else if (data.imageUrl) {
                        setActiveImage(data.imageUrl);
                    }
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

    // Prepare images list for gallery
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
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
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div
                                ref={imageRef}
                                className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden cursor-zoom-in group border border-border"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {activeImage ? (
                                    <>
                                        <Image
                                            src={activeImage}
                                            alt={product.name}
                                            fill
                                            className={`object-cover transition-transform duration-200 ${isZoomed ? "scale-150" : "scale-100"}`}
                                            style={isZoomed ? {
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                            } : {}}
                                            priority
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <ZoomIn className="h-4 w-4" />
                                            Hover to zoom
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-24 w-24 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-6 gap-2">
                                    {galleryImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImage === img
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-transparent hover:border-muted-foreground/50"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} view ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div>
                                <Badge variant="outline" className="mb-4 text-accent border-accent/20 bg-accent/5">
                                    Product Category
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
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
                                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <Package className="h-5 w-5" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">MOQ</span>
                                    </div>
                                    <div className="font-bold text-xl">
                                        {product.minOrderQuantity?.toLocaleString() || "500"}+
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Minimum Order</div>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Lead Time</span>
                                    </div>
                                    <div className="font-bold text-xl">
                                        {product.leadTime || "3-5 Weeks"}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Production Time</div>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <Ruler className="h-5 w-5" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Sizes</span>
                                    </div>
                                    <div className="font-bold text-xl">
                                        {product.sizeRange || "XS-5XL"}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Available Range</div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                                <Link href="/enquiry" className="flex-1">
                                    <Button className="btn-industrial w-full h-12 text-lg" size="lg">
                                        Request Quote
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

            {/* Back to Catalogue */}
            <section className="bg-muted py-8 border-t border-border">
                <div className="container-industrial">
                    <Link href="/catalogue">
                        <Button variant="ghost" className="group hover:bg-transparent pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Catalogue
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

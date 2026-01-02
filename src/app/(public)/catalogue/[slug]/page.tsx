import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Package, Clock, Ruler,
    ArrowRight, ZoomIn
} from "lucide-react";
import { getCachedClothingTypes, getCachedClothingTypeBySlug } from "@/lib/services/cached-data";
import { Metadata } from "next";
import { ProductImageGallery } from "@/components/public/ProductImageGallery";

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

// Generate static pages for all products at build time
export async function generateStaticParams() {
    const types = await getCachedClothingTypes();
    return types.map((type: { slug: string }) => ({
        slug: type.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getCachedClothingTypeBySlug(slug) as ClothingType | null;

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${product.name} | Anshukkam Textile`,
        description: product.description || `Custom ${product.name} manufacturing. MOQ: ${product.minOrderQuantity || 500}+. Lead time: ${product.leadTime || "3-5 Weeks"}.`,
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getCachedClothingTypeBySlug(slug) as ClothingType | null;

    if (!product) {
        notFound();
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
                        <ProductImageGallery
                            images={galleryImages}
                            productName={product.name}
                        />

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

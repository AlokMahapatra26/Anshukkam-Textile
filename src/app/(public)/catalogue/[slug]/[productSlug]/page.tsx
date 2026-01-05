import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Package, Clock, Ruler,
    CheckCircle2, Mail, Share2
} from "lucide-react";
import { getCachedCatalogueItemBySlug, getCachedClothingTypeBySlug, getCachedNavigationData } from "@/lib/services/cached-data";
import { Metadata } from "next";

// Generate metadata
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string; productSlug: string }>
}): Promise<Metadata> {
    const { productSlug } = await params;
    const product = await getCachedCatalogueItemBySlug(productSlug);

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${product.name} | Anshukkam Textile`,
        description: product.description || `Custom manufacturing for ${product.name}.`,
    };
}

export default async function ProductPage({
    params
}: {
    params: Promise<{ slug: string; productSlug: string }>
}) {
    const { slug, productSlug } = await params;

    // Fetch category for breadcrumb and context
    const category = await getCachedClothingTypeBySlug(slug);
    // Fetch product
    const product = await getCachedCatalogueItemBySlug(productSlug);
    // Fetch all fabrics
    const { fabrics } = await getCachedNavigationData();

    if (!product || !category) {
        notFound();
    }

    // Ensure product belongs to category (optional check, but good for consistency)
    if (product.clothingTypeId !== category.id) {
        // If product exists but wrong category in URL, maybe redirect or 404.
        // For now, we'll just proceed as the product slug is unique anyway.
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    const availableFabrics = product.availableFabrics && product.availableFabrics.length > 0
        // @ts-ignore - availableFabrics might be string[] but includes expects string
        ? fabrics.filter(f => product.availableFabrics.includes(f.id))
        : fabrics;

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
                        <Link href={`/catalogue/${slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
                            {category.name}
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container-industrial py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-muted relative rounded-lg overflow-hidden border border-border">
                            {images.length > 0 ? (
                                <Image
                                    src={images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No image available
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.slice(1).map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-muted relative rounded-md overflow-hidden border border-border cursor-pointer hover:border-accent transition-colors">
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${idx + 2}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-8">
                        <div>
                            <Badge variant="outline" className="mb-4 text-accent border-accent/20 bg-accent/5">
                                {category.name}
                            </Badge>
                            <h1 className="text-4xl font-bold mb-4 text-foreground">{product.name}</h1>
                            {product.description && (
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Key Specs */}
                        <div className="grid grid-cols-2 gap-4 p-6 bg-muted/30 rounded-lg border border-border">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="h-4 w-4 text-accent" />
                                    <span>Minimum Order</span>
                                </div>
                                <p className="font-semibold text-foreground">{product.minOrderQuantity || 100} Pieces</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-accent" />
                                    <span>Lead Time</span>
                                </div>
                                <p className="font-semibold text-foreground">{product.leadTime || "3-4 Weeks"}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Ruler className="h-4 w-4 text-accent" />
                                    <span>Size Range</span>
                                </div>
                                <p className="font-semibold text-foreground">{product.sizeRange || "XS-5XL"}</p>
                            </div>
                            {product.productionCapacity && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-accent" />
                                        <span>Capacity</span>
                                    </div>
                                    <p className="font-semibold text-foreground">{product.productionCapacity}</p>
                                </div>
                            )}
                        </div>

                        {/* Available Fabrics */}
                        <div>
                            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">Available Fabrics</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableFabrics.map(fabric => (
                                    <Link key={fabric.id} href={`/fabrics/${fabric.slug}`}>
                                        <Badge variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer px-3 py-1">
                                            {fabric.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                            <Link href={`/enquiry?category=${category.id}&product=${product.id}`} className="flex-1">
                                <Button className="w-full btn-industrial h-12 text-lg">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Enquire About This Product
                                </Button>
                            </Link>
                            {/* <Button variant="outline" className="h-12 px-6">
                                <Share2 className="mr-2 h-5 w-5" />
                                Share
                            </Button> */}
                        </div>

                        {/* Additional Info */}
                        <div className="prose prose-sm text-muted-foreground">
                            <h3 className="text-foreground font-semibold mb-2">Customization Options</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Custom fabric selection (Cotton, Polyester, Blends, etc.)</li>
                                <li>Private labeling and branding</li>
                                <li>Custom sizing charts</li>
                                <li>Printing and embroidery services</li>
                                <li>Custom packaging options</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

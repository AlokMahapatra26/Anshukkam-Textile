import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ArrowRight, Scissors, PenTool
} from "lucide-react";
import { getCachedClothingTypes, getCachedClothingTypeBySlug, getCachedCatalogueItems } from "@/lib/services/cached-data";
import { Metadata } from "next";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
}

// Generate static pages for all categories at build time
export async function generateStaticParams() {
    const types = await getCachedClothingTypes();
    return types.map((type: { slug: string }) => ({
        slug: type.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCachedClothingTypeBySlug(slug) as Category | null;

    if (!category) {
        return { title: "Category Not Found" };
    }

    return {
        title: `${category.name} | Anshukkam Textile`,
        description: category.description || `Custom ${category.name} manufacturing. Browse our collection.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCachedClothingTypeBySlug(slug) as Category | null;

    if (!category) {
        notFound();
    }

    const products = await getCachedCatalogueItems(category.id);

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
                            Categories
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{category.name}</span>
                    </div>
                </div>
            </div>

            {/* Category Header */}
            <section className="bg-card border-b border-border py-12">
                <div className="container-industrial">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            {category.name}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-industrial bg-muted/30">
                <div className="container-industrial">
                    <h2 className="text-2xl font-bold mb-8">Available Products</h2>

                    {products.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg">
                            <Scissors className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products added yet</h3>
                            <p className="text-muted-foreground mb-6">
                                We are currently updating our catalogue for {category.name}.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Request Custom Quote</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/catalogue/${slug}/${product.slug}`}
                                    className="group relative bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-accent"
                                >
                                    <div className="p-6">
                                        {/* Image */}
                                        <div className="aspect-[4/3] bg-muted mb-6 relative overflow-hidden rounded-sm border border-border group-hover:border-accent/30 transition-colors">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
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
                                                {product.minOrderQuantity || category.minOrderQuantity || 100}+ MOQ
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                                                    {product.name}
                                                </h3>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                                            </div>

                                            {product.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            )}
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

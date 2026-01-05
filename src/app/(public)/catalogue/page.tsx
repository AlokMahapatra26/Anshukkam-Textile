import Link from "next/link";
import Image from "next/image";
import { Shirt, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedClothingTypes } from "@/lib/services/cached-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Catalogue | Anshukkam Textile",
    description: "Explore our full range of garment categories. T-Shirts, Polos, Hoodies, Jackets, Workwear, and more. All products can be customized to your specifications.",
};

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

export default async function CataloguePage() {
    const types = await getCachedClothingTypes() as ClothingType[];

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
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Product Categories</h1>
                        <p className="text-xl text-primary-foreground/80 leading-relaxed">
                            Browse our manufacturing categories. Select a category to view available products.
                        </p>
                    </div>
                </div>
            </section>

            {/* Catalogue Grid */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {types.length === 0 ? (
                        <div className="text-center py-16">
                            <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No categories yet</h2>
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
                                    className="group relative bg-card border border-border overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:border-accent"
                                >
                                    <div className="aspect-[3/2] bg-muted relative overflow-hidden">
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
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                                                {item.name}
                                            </h3>
                                            {item.description && (
                                                <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}
                                            <div className="mt-4 flex items-center text-xs font-medium text-accent opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                View Products <span className="ml-1">→</span>
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

import Link from "next/link";
import Image from "next/image";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";
import { getCachedClothingTypes } from "@/lib/services/cached-data";

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

export async function CatalogueGrid() {
    const types = await getCachedClothingTypes() as ClothingType[];

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
                            Product Categories
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
                <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {types.map((item) => (
                        <FadeInItem key={item.id}>
                            <Link
                                href={`/catalogue/${item.slug}`}
                                className="group relative bg-card overflow-hidden rounded-lg block h-full border border-border hover:shadow-lg hover:border-accent transition-all duration-300"
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
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
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
                        </FadeInItem>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}

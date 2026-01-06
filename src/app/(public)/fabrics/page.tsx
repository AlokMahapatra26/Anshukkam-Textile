import Link from "next/link";
import Image from "next/image";
import { Layers, ArrowRight, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedFabrics } from "@/lib/services/cached-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fabric Options | Anshukkam Textile",
    description: "Explore our premium fabric collection. Quality-tested materials from certified suppliers. Cotton, Polyester, Blends, and more available in bulk quantities.",
};

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    imageUrl: string | null;
}

export default async function FabricsPage() {
    const fabrics = await getCachedFabrics() as Fabric[];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-2xl md:text-3xl font-medium mb-3">Fabric Options</h1>
                        <p className="text-sm text-primary-foreground/70 font-light">
                            Quality-tested materials from certified suppliers. All fabrics
                            available in bulk quantities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fabrics Grid */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {fabrics.length === 0 ? (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {fabrics.map((fabric) => (
                                <Link
                                    key={fabric.id}
                                    href={`/fabrics/${fabric.slug}`}
                                    className="group bg-white p-4 rounded-sm shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Fabric Swatch Look */}
                                    <div className="relative aspect-square mb-4 overflow-hidden rounded-sm bg-muted shadow-inner">
                                        {fabric.imageUrl ? (
                                            <Image
                                                src={fabric.imageUrl}
                                                alt={fabric.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                <Layers className="h-12 w-12 text-muted-foreground/20" />
                                            </div>
                                        )}

                                        {/* Texture Overlay Effect */}
                                        <div className="absolute inset-0 bg-[url('/texture-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                                        {/* Hover Info */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fabric Info Card */}
                                    <div className="relative">
                                        {/* Pinking Shears Edge Effect (CSS) */}
                                        <div className="absolute -top-6 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_2px,#fff_2px)] bg-[length:6px_6px] -mt-1" />

                                        <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                                            {fabric.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <span className="px-2 py-0.5 bg-muted rounded-full">
                                                {fabric.composition || "N/A"}
                                            </span>
                                            <span>•</span>
                                            <span>{fabric.weight || "N/A"}</span>
                                        </div>

                                        <div className="flex items-center text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                            Explore Fabric <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}

        </div>
    );
}

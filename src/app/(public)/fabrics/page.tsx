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
            <section className="relative bg-primary text-primary-foreground py-24 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Fabric Options</h1>
                        <p className="text-xl text-primary-foreground/80 leading-relaxed">
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
            <section className="bg-muted py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Need custom fabric sourcing?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        We can source any fabric type for your order.
                        Contact us with your specific requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button className="btn-industrial">Request Quote</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, MapPin } from "lucide-react";

export function Hero() {
    return (
        <section className="relative bg-grid-pattern overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />

            <div className="relative container-industrial">
                <div className="py-20 md:py-32 lg:py-40">
                    <div className="max-w-3xl">
                        {/* Tagline */}
                        <p className="text-accent font-medium mb-4 tracking-wide">
                            Every dream starts small. Ours began with a single thread.
                        </p>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            <span className="text-accent">Anshuukam Textile</span>{" "}
                            — Where Quality Meets Passion
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                            Every stitch, every thread, and every design reflects our belief —
                            quality isn't just made, it's crafted with care. From fabric checking
                            to final dispatch, we bring together skill, precision, and trust under one roof.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link href="/enquiry">
                                <Button size="lg" className="btn-industrial text-base h-12 px-8">
                                    Request a Quote
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/catalogue">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="btn-industrial-outline text-base h-12 px-8"
                                >
                                    View Catalogue
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-accent" />
                                <span>Crafted with Care</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-accent" />
                                <span>Quality Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-accent" />
                                <span>Made in Neemuch, M.P.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

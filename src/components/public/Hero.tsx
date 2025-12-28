import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Factory, Shield, Clock } from "lucide-react";

export function Hero() {
    return (
        <section className="relative bg-grid-pattern overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />

            <div className="relative container-industrial">
                <div className="py-20 md:py-32 lg:py-40">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        {/* <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Factory className="h-4 w-4" />
                            <span>Established 1998 · ISO 9001 Certified</span>
                        </div> */}

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            High-Volume{" "}
                            <span className="text-accent">Textile Manufacturing</span>{" "}
                            You Can Trust
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                            From design to delivery, we produce premium quality garments at scale.
                            Serving global brands with consistent quality, competitive pricing,
                            and reliable lead times.
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
                                <Shield className="h-5 w-5 text-accent" />
                                <span>Quality Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-accent" />
                                <span>On-Time Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Factory className="h-5 w-5 text-accent" />
                                <span>100K+ Monthly Capacity</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, CheckCircle, Sparkles } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-widest text-accent-foreground/60 mb-3">Our Story</p>
                        <h1 className="text-2xl md:text-3xl font-medium mb-3">
                            Where Fabric Meets Emotion
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light">
                            A dream that started with passion and dedication has now taken shape
                            into a professional garment manufacturing unit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* <Sparkles className="h-12 w-12 mx-auto mb-6 text-accent" /> */}
                        <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
                            "Every stitch, every thread, and every design reflects our belief —
                            <span className="text-accent"> quality isn't just made, it's crafted with care.</span>"
                        </blockquote>
                        <p className="text-muted-foreground text-lg">
                            From fabric checking to final dispatch, we bring together skill,
                            precision, and trust under one roof. Proudly based in Neemuch (M.P.),
                            we're here to deliver excellence in every piece we create.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="section-industrial-alt">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Founders Image Placeholder */}
                        <div className="bg-muted rounded-lg aspect-square flex items-center justify-center">
                            <div className="text-center p-8">
                                <Users className="h-24 w-24 mx-auto mb-4 text-accent/50" />
                                <p className="text-muted-foreground">Purva & Sanath Sharma</p>
                                <p className="text-sm text-muted-foreground/70">Founders</p>
                            </div>
                        </div>

                        {/* Founders Story */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Meet the Founders
                            </h2>
                            <p className="text-muted-foreground mb-4 text-lg">
                                Behind every strong brand, there's a story stitched with courage,
                                consistency, and belief.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Ours began with two minds, one vision — to build something meaningful.
                                A dream company built together, where passion becomes partnership
                                and the result is pure creation.
                            </p>
                            <p className="text-muted-foreground mb-6">
                                Together, we are shaping Anshuukam Textile Pvt Ltd — a space where
                                fabric meets emotion, and quality meets trust.
                            </p>

                            {/* Founders Names */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card border border-border p-4 rounded-lg">
                                    <p className="font-semibold">Purva Jain</p>
                                    <p className="text-sm text-muted-foreground">Director</p>
                                </div>
                                <div className="bg-card border border-border p-4 rounded-lg">
                                    <p className="font-semibold">Sanath Sharma</p>
                                    <p className="text-sm text-muted-foreground">Director</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <h2 className="text-3xl font-bold mb-2 text-center">What We Stand For</h2>
                    <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
                        This is more than a company — it's a journey woven with hard work, vision, and dreams come true.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card border border-border p-6 text-center">
                            <Heart className="h-10 w-10 mx-auto mb-4 text-accent" />
                            <h3 className="text-xl font-bold mb-3">Crafted with Care</h3>
                            <p className="text-muted-foreground">
                                Every garment goes through meticulous quality checks.
                                We believe quality isn't just made — it's crafted.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-6 text-center">
                            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-accent" />
                            <h3 className="text-xl font-bold mb-3">Precision & Trust</h3>
                            <p className="text-muted-foreground">
                                From fabric selection to final dispatch, we bring together
                                skill, precision, and trust under one roof.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-6 text-center">
                            <Users className="h-10 w-10 mx-auto mb-4 text-accent" />
                            <h3 className="text-xl font-bold mb-3">Partnership</h3>
                            <p className="text-muted-foreground">
                                When passion becomes partnership, the result is pure creation.
                                We grow together with our clients.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Info */}
            <section className="bg-muted py-12">
                <div className="container-industrial">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-accent" />
                            <span>Neemuch, Madhya Pradesh, India</span>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-semibold">Anshuukam Textile Private Limited</p>
                            <p className="text-sm text-muted-foreground">GSTIN: 23ABBCA8915B1Z5</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to create something beautiful?</h2>
                    <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                        Let's bring your vision to life. Get in touch to discuss your requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button variant="secondary" size="lg">
                            Request Quote
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

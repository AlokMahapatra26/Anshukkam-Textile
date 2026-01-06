import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, CheckCircle, Sparkles } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden border-b border-white/10">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="section-tag mb-2 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            OUR STORY
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">
                            Where Fabric Meets Emotion
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light max-w-2xl leading-relaxed font-mono">
                            A dream that started with passion and dedication has now taken shape
                            into a professional garment manufacturing unit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="section-industrial relative">
                <div className="container-industrial relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block border border-accent/20 bg-accent/5 px-4 py-1 rounded-full text-xs font-mono text-accent mb-8">
                            MISSION_STATEMENT.TXT
                        </div>
                        <blockquote className="text-3xl md:text-4xl font-medium mb-8 leading-relaxed font-serif-display">
                            "Every stitch, every thread, and every design reflects our belief —
                            <span className="text-accent italic"> quality isn't just made, it's crafted with care.</span>"
                        </blockquote>
                        <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto font-light">
                            From fabric checking to final dispatch, we bring together skill,
                            precision, and trust under one roof. Proudly based in Neemuch (M.P.),
                            we're here to deliver excellence in every piece we create.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="section-industrial-alt border-y border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-metal-mesh opacity-5" />
                <div className="container-industrial relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Founders Image Placeholder */}
                        <div className="card-factory aspect-square flex items-center justify-center bg-muted/50 relative group">
                            <div className="absolute inset-0 border-2 border-dashed border-accent/20 m-4 rounded-sm" />
                            <div className="text-center p-8 relative z-10">
                                <Users className="h-24 w-24 mx-auto mb-4 text-accent/50 group-hover:text-accent transition-colors duration-500" />
                                <p className="text-lg font-serif-display text-foreground">Purva & Sanath Sharma</p>
                                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">Founders • Directors</p>
                            </div>

                            {/* Technical Corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent opacity-50" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent opacity-50" />
                        </div>

                        {/* Founders Story */}
                        <div>
                            <div className="section-tag mb-6">
                                <span className="w-2 h-2 bg-accent rounded-full" />
                                LEADERSHIP
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">
                                Meet the Founders
                            </h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                <p>
                                    Behind every strong brand, there's a story stitched with courage,
                                    consistency, and belief.
                                </p>
                                <p>
                                    Ours began with two minds, one vision — to build something meaningful.
                                    A dream company built together, where passion becomes partnership
                                    and the result is pure creation.
                                </p>
                                <p>
                                    Together, we are shaping Anshuukam Textile Pvt Ltd — a space where
                                    fabric meets emotion, and quality meets trust.
                                </p>
                            </div>

                            {/* Founders Names */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {[
                                    { name: "Purva Jain", role: "Director", id: "01" },
                                    { name: "Sanath Sharma", role: "Director", id: "02" }
                                ].map((founder) => (
                                    <div key={founder.name} className="card-factory p-4 bg-background hover:border-accent transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono text-muted-foreground">DIR-{founder.id}</span>
                                        </div>
                                        <p className="font-bold font-serif-display text-lg">{founder.name}</p>
                                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{founder.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="text-center mb-12">
                        <div className="section-tag inline-block mb-4">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            CORE VALUES
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif-display">What We Stand For</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-mono text-sm">
                            This is more than a company — it's a journey woven with hard work, vision, and dreams come true.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Crafted with Care",
                                icon: Heart,
                                desc: "Every garment goes through meticulous quality checks. We believe quality isn't just made — it's crafted.",
                                id: "VAL-01"
                            },
                            {
                                title: "Precision & Trust",
                                icon: CheckCircle,
                                desc: "From fabric selection to final dispatch, we bring together skill, precision, and trust under one roof.",
                                id: "VAL-02"
                            },
                            {
                                title: "Partnership",
                                icon: Users,
                                desc: "When passion becomes partnership, the result is pure creation. We grow together with our clients.",
                                id: "VAL-03"
                            }
                        ].map((value) => (
                            <div key={value.id} className="card-factory p-8 text-center group hover:border-accent transition-all duration-300">
                                <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground opacity-50">
                                    {value.id}
                                </div>
                                <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                                    <value.icon className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-serif-display group-hover:text-accent transition-colors">{value.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Company Info */}
            <section className="bg-muted/50 py-12 border-t border-dashed border-border">
                <div className="container-industrial">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 card-factory p-8 bg-background">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-accent/10 rounded-full">
                                <MapPin className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Headquarters</p>
                                <span className="font-medium">Neemuch, Madhya Pradesh, India</span>
                            </div>
                        </div>
                        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
                            <p className="font-bold font-serif-display text-lg mb-1">Anshuukam Textile Private Limited</p>
                            <p className="text-xs font-mono text-muted-foreground bg-muted inline-block px-2 py-1 rounded">GSTIN: 23ABBCA8915B1Z5</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-blueprint mix-blend-overlay opacity-20" />

                <div className="container-industrial relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">Ready to create something beautiful?</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg font-light">
                        Let's bring your vision to life. Get in touch to discuss your requirements.
                    </p>
                    <Link href="/enquiry">
                        <Button variant="secondary" size="lg" className="h-12 px-8 text-base font-medium hover:bg-accent hover:text-white transition-colors">
                            Request Quote
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

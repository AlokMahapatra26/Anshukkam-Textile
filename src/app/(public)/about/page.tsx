import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Factory, Award, Users, Globe, CheckCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl">
                        Your trusted partner in high-quality garment manufacturing
                    </p>
                </div>
            </section>

            {/* About Content */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Text Content */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Leading Garment Manufacturer
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                With over two decades of experience in the textile industry,
                                we have established ourselves as a premier B2B garment manufacturing
                                partner for brands worldwide.
                            </p>
                            <p className="text-muted-foreground mb-6">
                                Our state-of-the-art facilities, combined with skilled craftsmanship
                                and rigorous quality control, enable us to deliver products that
                                meet the highest international standards.
                            </p>

                            {/* Features List */}
                            <div className="space-y-4">
                                {[
                                    "ISO 9001 Certified Manufacturing",
                                    "Ethical & Sustainable Practices",
                                    "Full-Service Production Line",
                                    "Custom Design & Development",
                                    "Global Shipping & Logistics",
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 text-center">
                                <Factory className="h-10 w-10 mx-auto mb-4 text-accent" />
                                <div className="text-3xl font-bold mb-2">25+</div>
                                <p className="text-muted-foreground">Years Experience</p>
                            </div>
                            <div className="bg-card border border-border p-6 text-center">
                                <Users className="h-10 w-10 mx-auto mb-4 text-accent" />
                                <div className="text-3xl font-bold mb-2">500+</div>
                                <p className="text-muted-foreground">Happy Clients</p>
                            </div>
                            <div className="bg-card border border-border p-6 text-center">
                                <Globe className="h-10 w-10 mx-auto mb-4 text-accent" />
                                <div className="text-3xl font-bold mb-2">50+</div>
                                <p className="text-muted-foreground">Countries Served</p>
                            </div>
                            <div className="bg-card border border-border p-6 text-center">
                                <Award className="h-10 w-10 mx-auto mb-4 text-accent" />
                                <div className="text-3xl font-bold mb-2">100K+</div>
                                <p className="text-muted-foreground">Monthly Capacity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-industrial-alt">
                <div className="container-industrial">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card border border-border p-6">
                            <h3 className="text-xl font-bold mb-3">Quality First</h3>
                            <p className="text-muted-foreground">
                                Every garment goes through rigorous quality checks to ensure
                                it meets our high standards before shipping.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-6">
                            <h3 className="text-xl font-bold mb-3">Reliability</h3>
                            <p className="text-muted-foreground">
                                We deliver on time, every time. Our production schedules are
                                carefully managed to meet your deadlines.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-6">
                            <h3 className="text-xl font-bold mb-3">Partnership</h3>
                            <p className="text-muted-foreground">
                                We work closely with our clients to understand their needs
                                and provide tailored solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to work with us?</h2>
                    <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                        Get in touch to discuss your manufacturing needs and receive a
                        customized quote.
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

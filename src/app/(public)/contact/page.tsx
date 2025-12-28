import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl">
                        Get in touch with our team for enquiries, quotes, or any questions
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                            <p className="text-muted-foreground mb-8">
                                Have questions about our products or services? Want to request
                                a quote? Our team is here to help.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Mail className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">info@premiumtextiles.com</p>
                                        <p className="text-muted-foreground">sales@premiumtextiles.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Phone className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-muted-foreground">+1 (555) 987-6543</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <MapPin className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Address</h3>
                                        <p className="text-muted-foreground">
                                            123 Industrial Avenue<br />
                                            Manufacturing District<br />
                                            City, State 12345
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Clock className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                        <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Quote Card */}
                        <div className="bg-card border border-border p-8">
                            <h2 className="text-2xl font-bold mb-4">Request a Quote</h2>
                            <p className="text-muted-foreground mb-6">
                                Ready to start your order? Fill out our detailed enquiry form
                                to receive a customized quote.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                        1
                                    </div>
                                    <span>Select your product type</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                        2
                                    </div>
                                    <span>Specify quantity & details</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                        3
                                    </div>
                                    <span>Receive your quote within 24 hours</span>
                                </div>
                            </div>

                            <Link href="/enquiry">
                                <Button className="btn-industrial w-full" size="lg">
                                    Start Enquiry Form
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted py-12">
                <div className="container-industrial text-center">
                    <h2 className="text-2xl font-bold mb-4">Need urgent assistance?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        For urgent enquiries, please call our sales hotline directly.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Phone className="h-6 w-6 text-accent" />
                        <span className="text-2xl font-bold">+1 (555) 123-4567</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

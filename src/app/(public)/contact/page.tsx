"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";

interface Settings {
    contact_email?: string;
    contact_phone?: string;
}

export default function ContactPage() {
    const [settings, setSettings] = useState<Settings>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch("/api/settings");
                const result = await response.json();
                if (result.success && result.data) {
                    setSettings(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const email = settings.contact_email || "info@premiumtextiles.com";
    const phone = settings.contact_phone || "+1 (555) 123-4567";

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
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-accent transition-colors">
                                                {email}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Phone className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <a href={`tel:${phone}`} className="text-muted-foreground hover:text-accent transition-colors">
                                                {phone}
                                            </a>
                                        )}
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

                            {/* Quick Quote Card */}
                            <div className="bg-card border border-border p-6 mt-8">
                                <h3 className="text-xl font-bold mb-4">Request a Quote</h3>
                                <p className="text-muted-foreground mb-4">
                                    Fill out our enquiry form to receive a customized quote within 24 hours.
                                </p>
                                <Link href="/enquiry">
                                    <Button className="btn-industrial w-full">
                                        Start Enquiry Form
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Our Location</h3>
                            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden border border-border shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Visit our manufacturing facility for a tour
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

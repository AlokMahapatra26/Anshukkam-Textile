import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container-industrial py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-xl">Anshuukam Textile</span>
                            <span className="text-xs opacity-70 uppercase tracking-wider">
                                Private Limited
                            </span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Where fabric meets emotion, and quality meets trust.
                            Every stitch crafted with care.
                        </p>
                        <p className="text-xs opacity-60">
                            GSTIN: 23ABBCA8915B1Z5
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Product Catalogue", href: "/catalogue" },
                                { name: "Fabric Options", href: "/fabrics" },
                                { name: "Our Factory", href: "/factory" },
                                { name: "About Us", href: "/about" },
                                { name: "Request Quote", href: "/enquiry" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Capabilities */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">We Manufacture</h3>
                        <ul className="space-y-3 text-sm opacity-80">
                            <li>T-Shirts & Polos</li>
                            <li>Hoodies & Sweatshirts</li>
                            <li>Jackets & Outerwear</li>
                            <li>Workwear & Uniforms</li>
                            <li>Athletic Wear</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm opacity-80">
                                    Neemuch, Madhya Pradesh, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm opacity-80">+91 84691 59877</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm opacity-80">info@anshuukam.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm opacity-60 flex items-center gap-1">
                        © {new Date().getFullYear()} Anshuukam Textile Pvt Ltd. Made with
                        <Heart className="h-4 w-4 mx-1 text-red-400" />
                        in India.
                    </p>
                    <div className="flex gap-6 text-sm opacity-60">
                        <Link href="/privacy" className="hover:opacity-100 transition-opacity">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:opacity-100 transition-opacity">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
